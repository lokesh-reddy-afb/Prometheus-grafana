const express = require('express');
const client = require('prom-client');
const app = express();

// Create a Registry and custom Counter metric
const register = new client.Registry();
const loginCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'path'],
  registers: [register]
});

// Simple route that increments the counter
app.get('/', (req, res) => {
  loginCounter.inc({ method: 'GET', path: '/' });
  res.send('Hello Monitoring World!');
});

// Metrics endpoint for Prometheus to scrape
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(8080, () => console.log('App listening on port 8080'));