import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { tailorResume } from './src/server/tailorGemini.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

app.post('/api/tailor-resume', async (req, res) => {
  try {
    const result = await tailorResume(req.body);
    res.json(result);
  } catch (err: any) {
    console.error('Server error:', err);
    res.status(500).json({ error: err?.message || 'Failed to tailor resume' });
  }
});

// Production static assets
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Resume Tailor server running at http://0.0.0.0:${PORT}`);
});
