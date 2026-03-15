import { getDatabase } from '../db/database';
import type { Dish, CreateDishDTO, UpdateDishDTO } from '../types';

export function getAllDishes(): Dish[] {
  const db = getDatabase();
  return db.prepare('SELECT * FROM dishes ORDER BY created_at DESC').all() as Dish[];
}

export function getDishById(id: number): Dish | undefined {
  const db = getDatabase();
  return db.prepare('SELECT * FROM dishes WHERE id = ?').get(id) as Dish | undefined;
}

export function createDish(dto: CreateDishDTO): Dish {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO dishes (name, category, weight, remark, created_by)
    VALUES (@name, @category, @weight, @remark, @created_by)
  `);
  const result = stmt.run({
    name: dto.name,
    category: dto.category || '其他',
    weight: dto.weight ?? 5,
    remark: dto.remark || '',
    created_by: dto.created_by || '匿名',
  });
  return getDishById(result.lastInsertRowid as number)!;
}

export function updateDish(id: number, dto: UpdateDishDTO): Dish | undefined {
  const db = getDatabase();
  const existing = getDishById(id);
  if (!existing) return undefined;

  const stmt = db.prepare(`
    UPDATE dishes
    SET name = @name, category = @category, weight = @weight, remark = @remark, updated_at = CURRENT_TIMESTAMP
    WHERE id = @id
  `);
  stmt.run({
    id,
    name: dto.name ?? existing.name,
    category: dto.category ?? existing.category,
    weight: dto.weight ?? existing.weight,
    remark: dto.remark ?? existing.remark,
  });
  return getDishById(id);
}

export function deleteDish(id: number): boolean {
  const db = getDatabase();
  const result = db.prepare('DELETE FROM dishes WHERE id = ?').run(id);
  return result.changes > 0;
}
