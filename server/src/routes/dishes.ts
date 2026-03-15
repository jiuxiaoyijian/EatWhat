import { Router, Request, Response } from 'express';
import * as dishService from '../services/dishService';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  const dishes = dishService.getAllDishes();
  res.json(dishes);
});

router.post('/', (req: Request, res: Response) => {
  const { name, category, weight, remark, created_by } = req.body;
  if (!name || typeof name !== 'string' || name.trim() === '') {
    res.status(400).json({ error: '菜品名称不能为空' });
    return;
  }
  if (weight !== undefined && (weight < 1 || weight > 10)) {
    res.status(400).json({ error: '权重必须在 1-10 之间' });
    return;
  }
  const dish = dishService.createDish({ name: name.trim(), category, weight, remark, created_by });
  res.status(201).json(dish);
});

router.put('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) {
    res.status(400).json({ error: '无效的菜品 ID' });
    return;
  }
  const { weight } = req.body;
  if (weight !== undefined && (weight < 1 || weight > 10)) {
    res.status(400).json({ error: '权重必须在 1-10 之间' });
    return;
  }
  const dish = dishService.updateDish(id, req.body);
  if (!dish) {
    res.status(404).json({ error: '菜品不存在' });
    return;
  }
  res.json(dish);
});

router.delete('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) {
    res.status(400).json({ error: '无效的菜品 ID' });
    return;
  }
  const deleted = dishService.deleteDish(id);
  if (!deleted) {
    res.status(404).json({ error: '菜品不存在' });
    return;
  }
  res.json({ message: '删除成功' });
});

export default router;
