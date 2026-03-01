// Vercel Serverless Function: AI SLD-to-Mimic Generator
// Uses OpenAI Vision (GPT-4o) to analyze Single Line Diagrams and generate mimic elements

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const SYSTEM_PROMPT = `You are a SCADA/power systems expert that analyzes Single Line Diagrams (SLDs).
Given an image of an SLD, identify all equipment, bus bars, connections, and labels.

Return a JSON array of MimicElement objects with this structure:
{
  "elements": [
    {
      "id": "el-1",
      "type": "string", // One of: CB, Isolator, EarthSwitch, Fuse, Contactor, LoadBreakSwitch, Transformer, Generator, Motor, CapacitorBank, Reactor, Battery, CT, PT, Meter, Transducer, Relay, BusBar, Cable, LightningArrester, Ground, Feeder, DGSet, AVR, RTCC, Annunciator, text, shape, value-display
      "x": 100, // approximate X position (0-1920)
      "y": 200, // approximate Y position (0-1080)
      "width": 60, // element width
      "height": 60, // element height
      "rotation": 0, // 0, 90, 180, or 270
      "zIndex": 0,
      "properties": {
        "label": "string", // equipment label from the diagram
        "tagBinding": "string", // suggested tag name
        "color": "#000000"
      }
    }
  ],
  "connections": [
    {
      "id": "conn-1",
      "fromId": "el-1",
      "toId": "el-2",
      "points": [{"x": 100, "y": 200}, {"x": 100, "y": 300}],
      "color": "#374151",
      "thickness": 2
    }
  ],
  "metadata": {
    "voltageLevel": "string",
    "substationType": "string",
    "equipmentCount": 0
  }
}

Rules:
- Position equipment logically on a 1920x1080 canvas
- Use horizontal/vertical line segments for connections (no diagonals)
- Detect voltage levels from labels and use appropriate colors: 132kV=#1E40AF, 33kV=#DC2626, 11kV=#16A34A
- Bus bars should be wide (200+px) and thin (10px height)
- Group related equipment vertically (CB, Isolator, CT are in a vertical chain)
- Add text labels for voltage levels, bay names, and equipment IDs
- Return ONLY valid JSON, no markdown or explanations`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OPENAI_API_KEY not configured' });
  }

  try {
    const { image } = req.body; // base64 encoded image

    if (!image) {
      return res.status(400).json({ error: 'Image data required (base64)' });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this Single Line Diagram and generate mimic elements JSON. Identify all equipment, bus bars, connections, voltage levels, and labels.',
              },
              {
                type: 'image_url',
                image_url: {
                  url: image.startsWith('data:') ? image : `data:image/png;base64,${image}`,
                  detail: 'high',
                },
              },
            ],
          },
        ],
        max_tokens: 4096,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        error: 'OpenAI API error',
        details: errorData.error?.message || 'Unknown error',
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    // Parse JSON from response (handle potential markdown wrapping)
    let parsed;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);
    } catch {
      return res.status(500).json({
        error: 'Failed to parse AI response',
        raw: content,
      });
    }

    return res.status(200).json(parsed);
  } catch (error) {
    console.error('Generate mimic error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
