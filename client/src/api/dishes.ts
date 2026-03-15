import type { Dish, CreateDishDTO, UpdateDishDTO, DrawResult, LotteryHistory } from '../types';

const STORAGE_KEYS = {
  dishes: 'eatwhat_dishes',
  history: 'eatwhat_history',
  nextDishId: 'eatwhat_next_dish_id',
  nextHistoryId: 'eatwhat_next_history_id',
};

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

function nowString(): string {
  return new Date().toLocaleString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  });
}

const DEFAULT_DISHES: Omit<Dish, 'id'>[] = [
  { name: '黄焖鸡米饭', category: '快餐', weight: 7, remark: '经典下饭', created_by: '系统', created_at: '', updated_at: '' },
  { name: '兰州拉面',   category: '面食', weight: 6, remark: '一清二白三红', created_by: '系统', created_at: '', updated_at: '' },
  { name: '麻辣烫',     category: '小吃', weight: 8, remark: '自选搭配', created_by: '系统', created_at: '', updated_at: '' },
  { name: '红烧牛肉面', category: '面食', weight: 6, remark: '', created_by: '系统', created_at: '', updated_at: '' },
  { name: '宫保鸡丁饭', category: '快餐', weight: 7, remark: '微辣下饭', created_by: '系统', created_at: '', updated_at: '' },
  { name: '番茄鸡蛋盖饭', category: '快餐', weight: 5, remark: '清淡之选', created_by: '系统', created_at: '', updated_at: '' },
  { name: '酸菜鱼',     category: '川菜', weight: 8, remark: '酸辣过瘾', created_by: '系统', created_at: '', updated_at: '' },
  { name: '沙县小吃',   category: '小吃', weight: 5, remark: '蒸饺拌面扁肉', created_by: '系统', created_at: '', updated_at: '' },
  { name: '麻辣香锅',   category: '川菜', weight: 7, remark: '重口必选', created_by: '系统', created_at: '', updated_at: '' },
  { name: '肉夹馍+凉皮', category: '小吃', weight: 6, remark: '西北经典套餐', created_by: '系统', created_at: '', updated_at: '' },
  { name: '煲仔饭',     category: '粤菜', weight: 6, remark: '锅巴超香', created_by: '系统', created_at: '', updated_at: '' },
  { name: '水饺',       category: '面食', weight: 5, remark: '三鲜/猪肉白菜', created_by: '系统', created_at: '', updated_at: '' },
];

function initDefaultDishes(): Dish[] {
  const now = nowString();
  const dishes = DEFAULT_DISHES.map((d, i) => ({
    ...d,
    id: i + 1,
    created_at: now,
    updated_at: now,
  }));
  saveDishes(dishes);
  localStorage.setItem(STORAGE_KEYS.nextDishId, String(dishes.length));
  return dishes;
}

function loadDishes(): Dish[] {
  const raw = localStorage.getItem(STORAGE_KEYS.dishes);
  if (raw) return JSON.parse(raw);
  return initDefaultDishes();
}

function saveDishes(dishes: Dish[]): void {
  localStorage.setItem(STORAGE_KEYS.dishes, JSON.stringify(dishes));
}

function loadHistory(): LotteryHistory[] {
  const raw = localStorage.getItem(STORAGE_KEYS.history);
  return raw ? JSON.parse(raw) : [];
}

function saveHistory(history: LotteryHistory[]): void {
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
}

function getNextId(key: string): number {
  const current = parseInt(localStorage.getItem(key) || '0');
  const next = current + 1;
  localStorage.setItem(key, String(next));
  return next;
}

export async function getAllDishes(): Promise<Dish[]> {
  return loadDishes().sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function createDish(dto: CreateDishDTO): Promise<Dish> {
  const dishes = loadDishes();
  const now = nowString();
  const dish: Dish = {
    id: getNextId(STORAGE_KEYS.nextDishId),
    name: dto.name,
    category: dto.category || '其他',
    weight: dto.weight ?? 5,
    remark: dto.remark || '',
    created_by: dto.created_by || '匿名',
    created_at: now,
    updated_at: now,
  };
  dishes.push(dish);
  saveDishes(dishes);
  return dish;
}

export async function updateDish(id: number, dto: UpdateDishDTO): Promise<Dish> {
  const dishes = loadDishes();
  const idx = dishes.findIndex(d => d.id === id);
  if (idx === -1) throw new Error('菜品不存在');
  const dish = dishes[idx];
  dishes[idx] = {
    ...dish,
    name: dto.name ?? dish.name,
    category: dto.category ?? dish.category,
    weight: dto.weight ?? dish.weight,
    remark: dto.remark ?? dish.remark,
    updated_at: nowString(),
  };
  saveDishes(dishes);
  return dishes[idx];
}

export async function deleteDish(id: number): Promise<void> {
  const dishes = loadDishes().filter(d => d.id !== id);
  saveDishes(dishes);
}

export async function drawLottery(): Promise<DrawResult> {
  const dishes = loadDishes();
  if (dishes.length === 0) throw new Error('没有可抽取的菜品');

  const totalWeight = dishes.reduce((sum, d) => sum + d.weight, 0);
  let random = Math.random() * totalWeight;
  let selected = dishes[0];
  for (const dish of dishes) {
    random -= dish.weight;
    if (random <= 0) { selected = dish; break; }
  }

  const luckyText = LUCKY_TEXTS[Math.floor(Math.random() * LUCKY_TEXTS.length)];
  const historyId = getNextId(STORAGE_KEYS.nextHistoryId);

  const history = loadHistory();
  history.unshift({
    id: historyId,
    dish_id: selected.id,
    dish_name: selected.name,
    lucky_text: luckyText,
    drawn_at: nowString(),
  });
  if (history.length > 200) history.length = 200;
  saveHistory(history);

  return { dish: selected, luckyText, historyId };
}

export async function getLotteryHistory(limit = 50): Promise<LotteryHistory[]> {
  return loadHistory().slice(0, limit);
}

export function exportDishesJson(): void {
  const dishes = loadDishes();
  const blob = new Blob([JSON.stringify(dishes, null, 2)], { type: 'application/json' });
  downloadBlob(blob, 'dishes.json');
}

export function exportDishesCsv(): void {
  const dishes = loadDishes();
  const header = 'ID,名称,分类,权重,备注,添加人,添加时间,更新时间';
  const rows = dishes.map(d =>
    [d.id, d.name, d.category, d.weight, d.remark, d.created_by, d.created_at, d.updated_at]
      .map(v => `"${String(v).replace(/"/g, '""')}"`)
      .join(',')
  );
  const csv = '\uFEFF' + [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  downloadBlob(blob, 'dishes.csv');
}

export function importDishesJson(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result as string) as Dish[];
        if (!Array.isArray(imported)) throw new Error('格式错误');
        const existing = loadDishes();
        let maxId = Math.max(0, ...existing.map(d => d.id));
        const newDishes = imported.map(d => ({ ...d, id: ++maxId }));
        saveDishes([...existing, ...newDishes]);
        localStorage.setItem(STORAGE_KEYS.nextDishId, String(maxId));
        resolve(newDishes.length);
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsText(file);
  });
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
