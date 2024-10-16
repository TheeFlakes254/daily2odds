import { handler } from '../build/handler.js';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Add a simple health check route
app.get('/health', (req, res) => {
    res.send('OK');
});

// Let SvelteKit handle everything else
app.use(handler);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});