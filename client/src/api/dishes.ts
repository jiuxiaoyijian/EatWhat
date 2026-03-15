import axios from 'axios';
import type { Dish, CreateDishDTO, UpdateDishDTO, DrawResult, LotteryHistory } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE || '';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { 'Content-Type': 'application/json' },
});

export async function getAllDishes(): Promise<Dish[]> {
  const { data } = await api.get<Dish[]>('/dishes');
  return data;
}

export async function createDish(dto: CreateDishDTO): Promise<Dish> {
  const { data } = await api.post<Dish>('/dishes', dto);
  return data;
}

export async function updateDish(id: number, dto: UpdateDishDTO): Promise<Dish> {
  const { data } = await api.put<Dish>(`/dishes/${id}`, dto);
  return data;
}

export async function deleteDish(id: number): Promise<void> {
  await api.delete(`/dishes/${id}`);
}

export async function drawLottery(): Promise<DrawResult> {
  const { data } = await api.post<DrawResult>('/lottery/draw');
  return data;
}

export async function getLotteryHistory(limit = 50): Promise<LotteryHistory[]> {
  const { data } = await api.get<LotteryHistory[]>('/lottery/history', { params: { limit } });
  return data;
}

export function getExportJsonUrl(): string {
  return `${API_BASE}/api/export/json`;
}

export function getExportCsvUrl(): string {
  return `${API_BASE}/api/export/csv`;
}
