import { Router, Request, Response } from 'express';
import * as dishService from '../services/dishService';

const router = Router();

router.get('/json', (_req: Request, res: Response) => {
  const dishes = dishService.getAllDishes();
  res.setHeader('Content-Disposition', 'attachment; filename=dishes.json');
  res.setHeader('Content-Type', 'application/json');
  res.json(dishes);
});

router.get('/csv', (_req: Request, res: Response) => {
  const dishes = dishService.getAllDishes();
  const header = 'ID,名称,分类,权重,备注,添加人,添加时间,更新时间';
  const rows = dishes.map(d =>
    [d.id, d.name, d.category, d.weight, d.remark, d.created_by, d.created_at, d.updated_at]
      .map(v => `"${String(v).replace(/"/g, '""')}"`)
      .join(',')
  );
  const csv = '\uFEFF' + [header, ...rows].join('\n');
  res.setHeader('Content-Disposition', 'attachment; filename=dishes.csv');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.send(csv);
});

export default router;
