import { getDatabase } from '../db/database';
import type { Dish, DrawResult, LotteryHistory } from '../types';

const LUCKY_TEXTS = [
  '今日干饭首选！',
  '天选打工人的午餐！',
  '命中注定的美味！',
  '就是它了，冲！',
  '今天就吃这个，不接受反驳！',
  '恭喜中奖，请享用！',
  '美食之神的选择！',
  '这顿必须安排上！',
  '幸运美食已送达！',
  '干饭人干饭魂，今天就吃它！',
  '宇宙的尽头是这道菜！',
  '今日份快乐由它承包！',
  '打工人的能量补给站！',
  '吃货雷达已锁定目标！',
  '人生苦短，先干这碗饭！',
];

function getRandomLuckyText(): string {
  return LUCKY_TEXTS[Math.floor(Math.random() * LUCKY_TEXTS.length)];
}

export function drawDish(): DrawResult | null {
  const db = getDatabase();
  const dishes = db.prepare('SELECT * FROM dishes').all() as Dish[];

  if (dishes.length === 0) return null;

  const totalWeight = dishes.reduce((sum, d) => sum + d.weight, 0);
  let random = Math.random() * totalWeight;

  let selected: Dish = dishes[0];
  for (const dish of dishes) {
    random -= dish.weight;
    if (random <= 0) {
      selected = dish;
      break;
    }
  }

  const luckyText = getRandomLuckyText();

  const stmt = db.prepare(`
    INSERT INTO lottery_history (dish_id, dish_name, lucky_text)
    VALUES (@dish_id, @dish_name, @lucky_text)
  `);
  const result = stmt.run({
    dish_id: selected.id,
    dish_name: selected.name,
    lucky_text: luckyText,
  });

  return {
    dish: selected,
    luckyText,
    historyId: result.lastInsertRowid as number,
  };
}

export function getHistory(limit: number = 50): LotteryHistory[] {
  const db = getDatabase();
  return db
    .prepare('SELECT * FROM lottery_history ORDER BY drawn_at DESC LIMIT ?')
    .all(limit) as LotteryHistory[];
}
