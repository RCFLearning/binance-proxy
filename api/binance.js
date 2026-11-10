export const config = {
  regions: ['fra1'], // Executes in Frankfurt, Germany
};

export default async function handler(req, res) {
  // If you open this URL in your browser, it will tell you Vercel's exact outbound IP
  if (req.query.check_ip) {
    const ipCheck = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipCheck.json();
    return res.status(200).json({ vercel_outbound_ip: ipData.ip });
  }

  try {
    const query = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
    const targetUrl = `https://fapi.binance.com/fapi/v2/positionRisk${query}`;

    // Read key from header OR fallback to your API key directly
    const apiKey = req.headers['x-mbx-apikey'] || 
                   req.headers['X-MBX-APIKEY'] || 
                   "MvASG9Moh9tOfL1WARRyhfvZI21mCDI7BePP5vRrfIIwNzR0sVJIFTVqnseQDIqR";

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'X-MBX-APIKEY': apiKey,
        'Content-Type': 'application/json',
      },
    });

    const body = await response.text();
    res.status(response.status).send(body);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
