import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { Dish, CreateDishDTO, UpdateDishDTO } from '../types';
import { getAllDishes, createDish, updateDish, deleteDish, exportDishesJson, exportDishesCsv, importDishesJson } from '../api/dishes';
import DishCard from '../components/DishCard';
import DishForm from '../components/DishForm';
import styles from './DishManagePage.module.css';

export default function DishManagePage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);

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

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const count = await importDishesJson(file);
      alert(`成功导入 ${count} 道菜品！`);
      await fetchDishes();
    } catch {
      alert('导入失败，请检查文件格式');
    }
    if (importRef.current) importRef.current.value = '';
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>菜品管理</h2>
        <div className={styles.headerActions}>
          <button className={styles.exportBtn} onClick={exportDishesJson}>导出JSON</button>
          <button className={styles.exportBtn} onClick={exportDishesCsv}>导出CSV</button>
          <button className={styles.exportBtn} onClick={() => importRef.current?.click()}>导入</button>
          <input ref={importRef} type="file" accept=".json" onChange={handleImport} hidden />
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
