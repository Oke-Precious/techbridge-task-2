import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Pure static file server only - no custom routes or JavaScript routing
app.use(express.static(__dirname));

app.listen(PORT, '0.0.0.0');
