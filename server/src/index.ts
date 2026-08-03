import path from 'path';
import dotenv from 'dotenv';

const envResult = dotenv.config({ path: path.resolve(__dirname, '../.env') });

import app from './app';

const PORT = process.env.PORT || 8080;

console.log('----------------------------------------------------');
console.log(`🚀 [DEV CANVAS BACKEND STARTUP]`);
console.log(`📌 [.env Loaded]:`, envResult.error ? 'FAILED' : 'SUCCESS');
console.log(`📌 [DATABASE_URL]:`, process.env.DATABASE_URL);
console.log(`📌 [CLIENT_URL]:`, process.env.CLIENT_URL);
console.log(`📌 [PORT]:`, PORT);
console.log('----------------------------------------------------');

app.listen(PORT, () => {
  console.log(`🚀 DevCanvas Server listening on http://localhost:${PORT}`);
});
