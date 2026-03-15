import express from 'express';
import cors from 'cors';
import path from 'path';
import dishesRouter from './routes/dishes';
import lotteryRouter from './routes/lottery';
import exportRouter from './routes/export';
import { closeDatabase } from './db/database';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/dishes', dishesRouter);
app.use('/api/lottery', lotteryRouter);
app.use('/api/export', exportRouter);

const clientDistPath = path.join(__dirname, '..', '..', 'client', 'dist');
app.use(express.static(clientDistPath));
app.get('/{*path}', (_req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[EatWhat] 服务已启动: http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  console.log('\n[EatWhat] 正在关闭服务...');
  closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', () => {
  closeDatabase();
  process.exit(0);
});
