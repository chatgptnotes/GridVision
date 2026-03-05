// Vercel serverless function - calls OpenAI directly (bypasses proxy timeout)
export const maxDuration = 60; // 60 second timeout

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse multipart form data
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks);
    
    // Extract boundary from content-type
    const contentType = req.headers['content-type'] || '';
    const boundaryMatch = contentType.match(/boundary=(.+)/);
    if (!boundaryMatch) return res.status(400).json({ error: 'No boundary in multipart' });
    
    const boundary = boundaryMatch[1];
    const boundaryBuf = Buffer.from('--' + boundary);
    
    // Find the file part
    let fileBuffer = null;
    let mimeType = 'image/jpeg';
    
    const parts = splitBuffer(body, boundaryBuf);
    for (const part of parts) {
      const headerEnd = part.indexOf('\r\n\r\n');
      if (headerEnd === -1) continue;
      const headers = part.slice(0, headerEnd).toString();
      if (headers.includes('filename=')) {
        const ctMatch = headers.match(/Content-Type:\s*(.+)/i);
        if (ctMatch) mimeType = ctMatch[1].trim();
        fileBuffer = part.slice(headerEnd + 4, part.length - 2); // trim trailing \r\n
      }
    }
    
    if (!fileBuffer || fileBuffer.length === 0) {
      return res.status(400).json({ error: 'No file found in upload' });
    }

    const base64Image = fileBuffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64Image}`;

    // Call OpenAI directly
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: dataUrl, detail: 'high' } },
            { type: 'text', text: `Please analyze this engineering schematic diagram and identify all the components visible in it.

For each component (transformers, circuit breakers, switches, busbars, feeders, cables, etc.) extract:
- A unique id (UUID format like "550e8400-e29b-41d4-a716-446655440001")
- type mapped to one of: CIRCUIT_BREAKER, ISOLATOR, EARTH_SWITCH, POWER_TRANSFORMER, CURRENT_TRANSFORMER, POTENTIAL_TRANSFORMER, BUS_BAR, FEEDER_LINE, LIGHTNING_ARRESTER, CAPACITOR_BANK
- label/name as visible in the diagram
- approximate x,y position (treat diagram as 1200x800 canvas)
- rotation: 0

Return ONLY a JSON object, no markdown:
{"id":"uuid","substationId":"uuid","name":"substation name","width":1200,"height":800,"elements":[{"id":"uuid","equipmentId":"uuid","type":"CIRCUIT_BREAKER","x":100,"y":200,"rotation":0,"label":"CB1"}],"connections":[]}` }
          ]
        }]
      })
    });

    const openaiData = await openaiRes.json();
    if (!openaiRes.ok) {
      return res.status(500).json({ error: openaiData.error?.message || 'OpenAI API error' });
    }

    const textContent = openaiData.choices?.[0]?.message?.content || '';
    
    // Extract JSON from response
    let jsonStr = textContent.trim();
    const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (fenceMatch) jsonStr = fenceMatch[1].trim();
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) jsonStr = jsonMatch[0];

    let layout;
    try {
      layout = JSON.parse(jsonStr);
    } catch {
      return res.status(500).json({ error: 'Failed to parse AI response as JSON: ' + textContent.substring(0, 200) });
    }

    // Normalize element types
    const TYPE_MAP = {
      BREAKER: 'CIRCUIT_BREAKER', CB: 'CIRCUIT_BREAKER',
      TRANSFORMER: 'POWER_TRANSFORMER', XFMR: 'POWER_TRANSFORMER', TX: 'POWER_TRANSFORMER',
      BUS: 'BUS_BAR', BUSBAR: 'BUS_BAR',
      DISCONNECT: 'ISOLATOR', SWITCH: 'ISOLATOR',
      EARTH: 'EARTH_SWITCH', GROUND: 'EARTH_SWITCH',
      CT: 'CURRENT_TRANSFORMER', CURRENT: 'CURRENT_TRANSFORMER',
      PT: 'POTENTIAL_TRANSFORMER', VT: 'POTENTIAL_TRANSFORMER',
      FEEDER: 'FEEDER_LINE', LINE: 'FEEDER_LINE', CABLE: 'FEEDER_LINE',
      ARRESTER: 'LIGHTNING_ARRESTER', SURGE: 'LIGHTNING_ARRESTER',
      CAPACITOR: 'CAPACITOR_BANK', CAP: 'CAPACITOR_BANK',
    };
    const VALID = ['CIRCUIT_BREAKER','ISOLATOR','EARTH_SWITCH','POWER_TRANSFORMER','CURRENT_TRANSFORMER','POTENTIAL_TRANSFORMER','BUS_BAR','FEEDER_LINE','LIGHTNING_ARRESTER','CAPACITOR_BANK'];
    
    function normalizeType(t) {
      const u = (t||'').toUpperCase().replace(/[-\s]/g,'_');
      if (VALID.includes(u)) return u;
      for (const [k,v] of Object.entries(TYPE_MAP)) {
        if (u.includes(k)) return v;
      }
      return 'FEEDER_LINE';
    }

    function uuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random()*16|0;
        return (c=='x'?r:(r&0x3|0x8)).toString(16);
      });
    }

    layout.id = layout.id || uuid();
    layout.substationId = layout.substationId || uuid();
    layout.name = layout.name || 'AI Generated SLD';
    layout.width = layout.width || 1200;
    layout.height = layout.height || 800;
    layout.elements = (layout.elements || []).map(el => ({
      ...el,
      id: el.id || uuid(),
      equipmentId: el.equipmentId || uuid(),
      type: normalizeType(el.type),
      rotation: el.rotation || 0,
    }));
    layout.connections = layout.connections || [];

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return res.status(200).json({ success: true, layout });

  } catch (err) {
    console.error('SLD generate error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

function splitBuffer(buf, delimiter) {
  const parts = [];
  let start = 0;
  let idx;
  while ((idx = indexOf(buf, delimiter, start)) !== -1) {
    if (start !== idx) parts.push(buf.slice(start, idx));
    start = idx + delimiter.length + 2; // skip \r\n after boundary
  }
  return parts.filter(p => p.length > 0);
}

function indexOf(buf, search, start = 0) {
  for (let i = start; i <= buf.length - search.length; i++) {
    let found = true;
    for (let j = 0; j < search.length; j++) {
      if (buf[i + j] !== search[j]) { found = false; break; }
    }
    if (found) return i;
  }
  return -1;
}
