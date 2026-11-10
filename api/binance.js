export const config = {
  // Locks execution strictly to Frankfurt, Germany (bypasses HTTP 451)
  regions: ['fra1'],
};

export default async function handler(req, res) {
  try {
    // Extract the signed query string (timestamp, signature, recvWindow)
    const query = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
    const targetUrl = `https://fapi.binance.com/fapi/v2/positionRisk${query}`;

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'X-MBX-APIKEY': req.headers['x-mbx-apikey'] || '',
        'Content-Type': 'application/json',
      },
    });

    const body = await response.text();
    res.status(response.status).send(body);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
