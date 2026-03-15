import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { Dish, CreateDishDTO, UpdateDishDTO } from '../types';
import { getAllDishes, createDish, updateDish, deleteDish, getExportJsonUrl, getExportCsvUrl } from '../api/dishes';
import DishCard from '../components/DishCard';
import DishForm from '../components/DishForm';
import styles from './DishManagePage.module.css';

export default function DishManagePage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchDishes = useCallback(async () => {
    try {
      const data = await getAllDishes();
      setDishes(data);
    } catch (err) {
      console.error('获取菜品失败:', err);
    }
  }, []);

  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  const handleCreate = async (data: CreateDishDTO | UpdateDishDTO) => {
    setLoading(true);
    try {
      await createDish(data as CreateDishDTO);
      await fetchDishes();
      setShowForm(false);
    } catch (err) {
      console.error('添加菜品失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: CreateDishDTO | UpdateDishDTO) => {
    if (!editingDish) return;
    setLoading(true);
    try {
      await updateDish(editingDish.id, data as UpdateDishDTO);
      await fetchDishes();
      setEditingDish(null);
    } catch (err) {
      console.error('更新菜品失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这道菜品吗？')) return;
    try {
      await deleteDish(id);
      await fetchDishes();
    } catch (err) {
      console.error('删除菜品失败:', err);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>菜品管理</h2>
        <div className={styles.headerActions}>
          <a href={getExportJsonUrl()} className={styles.exportBtn} download>JSON</a>
          <a href={getExportCsvUrl()} className={styles.exportBtn} download>CSV</a>
          <button className={styles.addBtn} onClick={() => { setShowForm(true); setEditingDish(null); }}>
            + 添加菜品
          </button>
        </div>
      </div>

      {(showForm || editingDish) && (
        <DishForm
          onSubmit={editingDish ? handleUpdate : handleCreate}
          onCancel={() => { setShowForm(false); setEditingDish(null); }}
          initialData={editingDish ?? undefined}
          loading={loading}
        />
      )}

      <div className={styles.stats}>
        共 {dishes.length} 道菜品
      </div>

      <div className={styles.grid}>
        <AnimatePresence>
          {dishes.map(dish => (
            <DishCard
              key={dish.id}
              dish={dish}
              onEdit={d => { setEditingDish(d); setShowForm(false); }}
              onDelete={handleDelete}
            />
          ))}
        </AnimatePresence>
      </div>

      {dishes.length === 0 && (
        <div className={styles.empty}>
          <p>还没有菜品，快来添加吧！</p>
        </div>
      )}
    </div>
  );
}
