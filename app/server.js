const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({
    message: 'ArgoApp is running',
    version: process.env.APP_VERSION || 'local',
    environment: process.env.APP_ENV || 'unknown',
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
