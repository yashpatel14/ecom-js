const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { url, method } = req;
  const origin = req.headers.origin;
  
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (method === 'OPTIONS') return res.status(204).end();
  
  const pathname = url.split('?')[0];
  const action = pathname.endsWith('/register') ? 'register' :
                 pathname.endsWith('/login') ? 'login' :
                 pathname.endsWith('/profile') ? 'profile' : null;

  if (!action) {
    return res.status(404).json({ success: false, message: 'Invalid route' });
  }
  
  try {
    let body = null;
    if (method !== 'GET') {
      body = await new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => resolve(data ? JSON.parse(data) : null));
        req.on('error', reject);
      });
    }
    
    const fetchOptions = {
      method,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    };
    
    if (body) {
      fetchOptions.body = JSON.stringify(body);
    }
    
    const apiResponse = await fetch(`https://api.freeapi.app/api/v1/users/${action}`, fetchOptions);
    
    // Forward Set-Cookie headers so browser can store tokens
    const setCookie = apiResponse.headers.raw()['set-cookie'];
    if (setCookie) {
      setCookie.forEach(cookie => {
        res.setHeader('Set-Cookie', cookie);
      });
    }
    
    const result = await apiResponse.json();
    return res.status(apiResponse.status).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
