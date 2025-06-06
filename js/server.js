const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { url, method } = req;
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') return res.status(200).end();

  const pathname = url.split('?')[0];
  const action = pathname.endsWith('/register') ? 'register' :
                 pathname.endsWith('/login') ? 'login' : null;

  if (!action) {
    return res.status(404).json({ success: false, message: 'Invalid route' });
  }

  try {
    const body = await new Promise((resolve) => {
      let data = '';
      req.on('data', chunk => data += chunk);
      req.on('end', () => resolve(JSON.parse(data)));
    });

    const response = await fetch(`https://api.freeapi.app/api/v1/users/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body)
    });

    const result = await response.json();
    res.status(response.status).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
