export interface Dish {
  id: number;
  name: string;
  category: string;
  weight: number;
  remark: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDishDTO {
  name: string;
  category?: string;
  weight?: number;
  remark?: string;
  created_by?: string;
}

export interface UpdateDishDTO {
  name?: string;
  category?: string;
  weight?: number;
  remark?: string;
}

export interface LotteryHistory {
  id: number;
  dish_id: number;
  dish_name: string;
  lucky_text: string;
  drawn_at: string;
}

export interface DrawResult {
  dish: Dish;
  luckyText: string;
  historyId: number;
}

export const CATEGORIES = ['快餐', '火锅', '面食', '粤菜', '川菜', '日料', '韩餐', '西餐', '小吃', '其他'] as const;
