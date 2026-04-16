// Minimal test — exits 0 on pass, 1 on fail
const http = require('http');

// Spawn the server in-process briefly and hit /health
process.env.PORT = '3001';
const server = require('./server');

setTimeout(() => {
  http.get('http://localhost:3001/health', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const body = JSON.parse(data);
      if (res.statusCode === 200 && body.status === 'ok') {
        console.log('Health check passed');
        process.exit(0);
      } else {
        console.error('Health check failed', res.statusCode, data);
        process.exit(1);
      }
    });
  }).on('error', (err) => {
    console.error('Request failed', err.message);
    process.exit(1);
  });
}, 500);
