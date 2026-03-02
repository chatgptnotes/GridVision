// Vercel serverless proxy to VPS backend
export default async function handler(req, res) {
  const target = `http://76.13.244.21:3002${req.url}`;
  
  const headers = { ...req.headers };
  delete headers.host;
  headers['host'] = '76.13.244.21:3002';
  
  try {
    const response = await fetch(target, {
      method: req.method,
      headers,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body),
    });
    
    const data = await response.text();
    
    // Forward response headers
    response.headers.forEach((value, key) => {
      if (!['transfer-encoding', 'content-encoding'].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });
    
    res.status(response.status).send(data);
  } catch (err) {
    res.status(502).json({ error: 'Backend unavailable', details: err.message });
  }
}
