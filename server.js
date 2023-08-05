// server.js
const express = require('express');
const IPFS = require('ipfs-http-server');

const app = express();
const ipfs = IPFS({ start: true });

// Define API routes for IPFS operations

app.post('/api/ipfs/add', async (req, res) => {
  try {
    const data = req.body;
    const result = await ipfs.add(data);
    res.json({ cid: result.cid.toString() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add data to IPFS.' });
  }
});

app.get('/api/ipfs/cat/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const chunks = [];
    for await (const chunk of ipfs.cat(cid)) {
      chunks.push(chunk);
    }
    const data = Buffer.concat(chunks).toString();
    res.json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data from IPFS.' });
  }
});

// Start the server
app.listen(3001, () => {
  console.log('IPFS server listening on http://localhost:3001');
});
