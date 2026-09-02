const express = require('express');
const path = require('path');
const app = express();

const port = process.env.PORT || 8080;

// Serve the built static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback for any other requests (useful for SPA routing or standard HTML)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
