const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'https://ecom-js-seven.vercel.app',
  credentials: true
}));

app.use(express.json());

app.post('/:action(register|login)', async (req, res) => {
  try {
    const { action } = req.params;
    const apiUrl = `https://api.freeapi.app/api/v1/users/${action}`;

    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const headers = apiResponse.headers.raw();
    if (headers['set-cookie']) {
      res.setHeader('Set-Cookie', headers['set-cookie']);
    }

    const data = await apiResponse.json();
    res.status(apiResponse.status).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/profile', (req, res) => {
  const cookies = req.headers.cookie || '';
  if (cookies.includes('accessToken')) {
    res.json({ success: true, message: 'Authenticated via cookie' });
  } else {
    res.status(401).json({ success: false, message: 'Not authenticated' });
  }
});

app.listen(3000, () => console.log('✅ Proxy server running at http://localhost:3000'));
