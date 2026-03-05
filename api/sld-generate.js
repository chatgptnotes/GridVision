// Vercel serverless function - calls OpenAI directly (bypasses 30s proxy timeout)
export const maxDuration = 60;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Accept JSON body with base64 image (client compresses before sending)
    const { image, mimeType = 'image/jpeg' } = req.body || {};
    if (!image) return res.status(400).json({ error: 'No image provided' });

    const dataUrl = `data:${mimeType};base64,${image}`;

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
    let jsonStr = textContent.trim();
    const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (fenceMatch) jsonStr = fenceMatch[1].trim();
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) jsonStr = jsonMatch[0];

    let layout;
    try {
      layout = JSON.parse(jsonStr);
    } catch {
      return res.status(500).json({ error: 'Failed to parse AI response: ' + textContent.substring(0, 200) });
    }

    const VALID = ['CIRCUIT_BREAKER','ISOLATOR','EARTH_SWITCH','POWER_TRANSFORMER','CURRENT_TRANSFORMER','POTENTIAL_TRANSFORMER','BUS_BAR','FEEDER_LINE','LIGHTNING_ARRESTER','CAPACITOR_BANK'];
    const TYPE_MAP = { BREAKER:'CIRCUIT_BREAKER',CB:'CIRCUIT_BREAKER',TRANSFORMER:'POWER_TRANSFORMER',XFMR:'POWER_TRANSFORMER',TX:'POWER_TRANSFORMER',BUS:'BUS_BAR',BUSBAR:'BUS_BAR',DISCONNECT:'ISOLATOR',SWITCH:'ISOLATOR',EARTH:'EARTH_SWITCH',GROUND:'EARTH_SWITCH',CT:'CURRENT_TRANSFORMER',PT:'POTENTIAL_TRANSFORMER',VT:'POTENTIAL_TRANSFORMER',FEEDER:'FEEDER_LINE',LINE:'FEEDER_LINE',CABLE:'FEEDER_LINE',ARRESTER:'LIGHTNING_ARRESTER',SURGE:'LIGHTNING_ARRESTER',CAPACITOR:'CAPACITOR_BANK' };
    function normalizeType(t) {
      const u = (t||'').toUpperCase().replace(/[-\s]/g,'_');
      if (VALID.includes(u)) return u;
      for (const [k,v] of Object.entries(TYPE_MAP)) { if (u.includes(k)) return v; }
      return 'FEEDER_LINE';
    }
    function uuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{ const r=Math.random()*16|0; return(c=='x'?r:(r&0x3|0x8)).toString(16); });
    }

    layout.id = layout.id || uuid();
    layout.substationId = layout.substationId || uuid();
    layout.name = layout.name || 'AI Generated SLD';
    layout.width = layout.width || 1200;
    layout.height = layout.height || 800;
    layout.elements = (layout.elements || []).map(el => ({
      ...el, id: el.id||uuid(), equipmentId: el.equipmentId||uuid(),
      type: normalizeType(el.type), rotation: el.rotation||0,
    }));
    layout.connections = layout.connections || [];

    return res.status(200).json({ success: true, layout });
  } catch (err) {
    console.error('SLD generate error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
