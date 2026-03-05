import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const TYPE_MAP: Record<string, { type: string; w: number; h: number }> = {
  CIRCUIT_BREAKER:       { type: 'CB',               w: 40, h: 40 },
  VACUUM_CB:             { type: 'VacuumCB',          w: 40, h: 40 },
  SF6_CB:                { type: 'SF6CB',             w: 40, h: 40 },
  ISOLATOR:              { type: 'Isolator',          w: 40, h: 25 },
  EARTH_SWITCH:          { type: 'EarthSwitch',       w: 30, h: 30 },
  POWER_TRANSFORMER:     { type: 'Transformer',       w: 70, h: 90 },
  CURRENT_TRANSFORMER:   { type: 'CT',                w: 35, h: 25 },
  POTENTIAL_TRANSFORMER: { type: 'PT',                w: 35, h: 25 },
  BUS_BAR:               { type: 'BusBar',            w: 0,  h: 8  }, // width computed dynamically
  FEEDER:                { type: 'Feeder',            w: 40, h: 60 },
  FEEDER_LINE:           { type: 'Feeder',            w: 40, h: 60 },
  LIGHTNING_ARRESTER:    { type: 'LightningArrester', w: 30, h: 50 },
  CAPACITOR_BANK:        { type: 'CapacitorBank',     w: 50, h: 50 },
  OVERHEAD_LINE:         { type: 'OverheadLine',      w: 100,h: 20 },
  CABLE:                 { type: 'Cable',             w: 80, h: 8  },
  METER:                 { type: 'Meter',             w: 40, h: 40 },
};

function normalizeType(t: string): { type: string; w: number; h: number } {
  const u = (t || '').toUpperCase().replace(/[-\s]/g, '_');
  if (TYPE_MAP[u]) return { ...TYPE_MAP[u] };
  if (u.includes('BREAKER') || u.includes('VCB') || u.includes('ACB') || u.match(/\bCB\b/)) return { ...TYPE_MAP.CIRCUIT_BREAKER };
  if (u.includes('TRANSFORM') || u.includes('XFMR') || u.includes('AVR') || u.includes('MVA')) return { ...TYPE_MAP.POWER_TRANSFORMER };
  if (u.includes('BUS')) return { ...TYPE_MAP.BUS_BAR };
  if (u.includes('FEEDER') || u.includes('OUTGOING') || u.includes('INCOMING')) return { ...TYPE_MAP.FEEDER };
  if (u.includes('ISOLAT') || u.includes('DISCONN')) return { ...TYPE_MAP.ISOLATOR };
  if (u.includes('EARTH') || u.includes('GROUND')) return { ...TYPE_MAP.EARTH_SWITCH };
  if (u.includes('ARRESTER') || u.includes('SURGE')) return { ...TYPE_MAP.LIGHTNING_ARRESTER };
  if (u.includes('METER') || u.includes('METERING')) return { ...TYPE_MAP.METER };
  return { ...TYPE_MAP.FEEDER };
}

export async function generateSLDFromImage(imageBuffer: Buffer, mimeType: string) {
  const base64Image = imageBuffer.toString('base64');
  const dataUrl = `data:${mimeType};base64,${base64Image}`;

  // Step 1: Extract topology with two-pass approach
  // First pass: identify all components and connections
  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 8192,
    messages: [{
      role: 'user',
      content: [
        { type: 'image_url', image_url: { url: dataUrl, detail: 'high' } },
        { type: 'text', text: `Analyze this electrical Single Line Diagram carefully.

Extract EVERY component visible. Look specifically for:
- Power Transformers (circles with T symbol, or "MVA" rating labels like "10 MVA", "1000 KVA")
- Circuit Breakers / VCBs (square symbols with X)
- Busbars (thick horizontal lines with voltage labels like "33kV", "11kV", "415V")
- Feeders / Outgoing panels (rectangles at bottom with feeder names)
- CTs, PTs, Isolators, Earth switches
- Incoming lines from grid

Return JSON:
{
  "name": "substation name",
  "components": [
    {
      "id": "unique_id",
      "type": "POWER_TRANSFORMER | CIRCUIT_BREAKER | BUS_BAR | FEEDER | ISOLATOR | EARTH_SWITCH | CT | PT | LIGHTNING_ARRESTER | OVERHEAD_LINE",
      "label": "exact label from diagram",
      "voltage": 33,
      "column": 0,
      "level": 0
    }
  ],
  "connections": [
    { "from": "id1", "to": "id2" }
  ]
}

Layout rules for column and level:
- level 0 = topmost (incoming grid supply / overhead lines)
- level 1 = first busbar (HV side, e.g. 33kV)
- level 2 = transformers
- level 3 = second busbar (LV side, e.g. 11kV)
- level 4 = circuit breakers on outgoing feeders
- level 5 = outgoing feeders / loads
- column = horizontal position (0=leftmost, increment for each parallel branch)

IMPORTANT: Do NOT skip transformers. If you see "MVA" or transformer symbols, include them as POWER_TRANSFORMER.
Return ONLY valid JSON.` }
      ]
    }]
  });

  const textContent = response.choices[0]?.message?.content || '';
  console.log('[SLD] Raw response length:', textContent.length);

  let jsonStr = textContent.trim();
  const fence = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fence) jsonStr = fence[1].trim();
  const jMatch = jsonStr.match(/\{[\s\S]*\}/);
  if (jMatch) jsonStr = jMatch[0];

  let parsed: any;
  try { parsed = JSON.parse(jsonStr); }
  catch { throw new Error('Failed to parse AI response: ' + textContent.substring(0, 300)); }

  const comps: any[] = parsed.components || [];
  if (comps.length === 0) throw new Error('No components detected in the diagram');
  console.log('[SLD] Detected components:', comps.length);

  // Layout engine - place components on canvas
  const CANVAS_W = 1600;
  const CANVAS_H = 900;
  const MARGIN   = 60;
  const USABLE_W = CANVAS_W - MARGIN * 2;
  const LEVEL_H  = 130; // vertical spacing per level

  // Group by level
  const byLevel = new Map<number, any[]>();
  for (const c of comps) {
    const lv = c.level ?? 0;
    if (!byLevel.has(lv)) byLevel.set(lv, []);
    byLevel.get(lv)!.push(c);
  }
  const levels = Array.from(byLevel.keys()).sort((a, b) => a - b);

  const elements: any[] = [];
  const idMap = new Map<string, string>();

  for (const lv of levels) {
    const group = byLevel.get(lv)!.sort((a, b) => (a.column ?? 0) - (b.column ?? 0));
    const maxCol = Math.max(...group.map(c => c.column ?? 0));
    const colCount = Math.max(maxCol + 1, group.length);
    const colW = USABLE_W / Math.max(colCount, 1);
    const y = MARGIN + lv * LEVEL_H;

    for (let i = 0; i < group.length; i++) {
      const comp = group[i];
      const sym = normalizeType(comp.type);
      const uid = uuidv4();
      idMap.set(comp.id, uid);

      let x: number, w: number, h: number;

      if (sym.type === 'BusBar') {
        // Busbar spans full usable width
        x = MARGIN;
        w = USABLE_W;
        h = 10;
      } else {
        const col = comp.column ?? i;
        const cx = MARGIN + col * colW + colW / 2;
        w = sym.w;
        h = sym.h;
        x = Math.round(cx - w / 2);
      }

      // Clamp to canvas
      x = Math.max(MARGIN, Math.min(CANVAS_W - w - MARGIN, x));
      const clampedY = Math.max(MARGIN, Math.min(CANVAS_H - h - 20, y));

      elements.push({
        id: uid,
        type: sym.type,
        x: Math.round(x),
        y: Math.round(clampedY),
        width: w,
        height: h,
        rotation: 0,
        zIndex: lv + 1,
        properties: {
          tagBindings: {},
          label: comp.label || '',
          showLabel: true,
          labelPosition: sym.type === 'BusBar' ? 'top' : 'bottom',
          voltageLevel: comp.voltage,
        },
      });
    }
  }

  // Build connections using actual pixel coordinates
  const connections: any[] = [];
  for (const conn of (parsed.connections || [])) {
    const fromUid = idMap.get(conn.from);
    const toUid   = idMap.get(conn.to);
    if (!fromUid || !toUid) continue;
    const fromEl = elements.find(e => e.id === fromUid);
    const toEl   = elements.find(e => e.id === toUid);
    if (!fromEl || !toEl) continue;

    // Determine connection direction (always top-to-bottom)
    const [topEl, botEl] = fromEl.y <= toEl.y ? [fromEl, toEl] : [toEl, fromEl];
    const [topUid, botUid] = fromEl.y <= toEl.y ? [fromUid, toUid] : [toUid, fromUid];

    const fx = Math.round(topEl.x + topEl.width / 2);
    const fy = Math.round(topEl.y + topEl.height);
    const tx = Math.round(botEl.x + botEl.width / 2);
    const ty = Math.round(botEl.y);

    const pts = fx === tx
      ? [{ x: fx, y: fy }, { x: tx, y: ty }]
      : [{ x: fx, y: fy }, { x: fx, y: Math.round((fy + ty) / 2) }, { x: tx, y: Math.round((fy + ty) / 2) }, { x: tx, y: ty }];

    connections.push({
      id: uuidv4(), fromId: topUid, toId: botUid,
      points: pts, color: '#374151', thickness: 2,
    });
  }

  console.log(`[SLD] Layout: ${elements.length} elements, ${connections.length} connections`);

  return {
    id: uuidv4(), substationId: uuidv4(),
    name: parsed.name || 'AI Generated SLD',
    width: CANVAS_W, height: CANVAS_H,
    elements, connections,
  };
}
