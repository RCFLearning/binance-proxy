export const config = {
  // Hardcodes execution strictly to Frankfurt, Germany to eliminate HTTP 451
  regions: ['fra1'],
};

export default async function handler(req, res) {
  // Extract path and query params (e.g., /fapi/v2/positionRisk?timestamp=...)
  const url = new URL(req.url, `https://${req.headers.host}`);
  const targetUrl = `https://fapi.binance.com${url.pathname}${url.search}`;

  try {
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
