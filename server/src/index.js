import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;

const __dirname = dirname(fileURLToPath(import.meta.url));
const clientDist = join(__dirname, '../../dist');

app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

// Serve React-appen i production
if (existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => res.sendFile(join(clientDist, 'index.html')));
}

app.listen(PORT, () => console.log(`Server kører på http://localhost:${PORT}`));
