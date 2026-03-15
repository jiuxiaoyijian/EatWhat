import { Router, Request, Response } from 'express';
import * as lotteryService from '../services/lotteryService';

const router = Router();

router.post('/draw', (_req: Request, res: Response) => {
  const result = lotteryService.drawDish();
  if (!result) {
    res.status(400).json({ error: '没有可抽取的菜品，请先添加菜品' });
    return;
  }
  res.json(result);
});

router.get('/history', (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 50;
  const history = lotteryService.getHistory(limit);
  res.json(history);
});

export default router;
