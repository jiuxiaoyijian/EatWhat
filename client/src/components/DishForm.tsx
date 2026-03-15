import { useState } from 'react';
import type { CreateDishDTO, Dish, UpdateDishDTO } from '../types';
import { CATEGORIES } from '../types';
import styles from './DishForm.module.css';

interface Props {
  onSubmit: (data: CreateDishDTO | UpdateDishDTO) => void;
  onCancel?: () => void;
  initialData?: Dish;
  loading?: boolean;
}

export default function DishForm({ onSubmit, onCancel, initialData, loading }: Props) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [category, setCategory] = useState(initialData?.category ?? '其他');
  const [weight, setWeight] = useState(initialData?.weight ?? 5);
  const [remark, setRemark] = useState(initialData?.remark ?? '');
  const [createdBy, setCreatedBy] = useState(initialData?.created_by ?? '');

  const isEdit = !!initialData;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const data: CreateDishDTO = {
      name: name.trim(),
      category,
      weight,
      remark: remark.trim(),
      created_by: createdBy.trim() || '匿名',
    };
    onSubmit(data);
    if (!isEdit) {
      setName('');
      setRemark('');
      setWeight(5);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label className={styles.label}>菜品名称 *</label>
        <input
          className={styles.input}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="例如：黄焖鸡米饭"
          required
        />
      </div>
      <div className={styles.rowGroup}>
        <div className={styles.row}>
          <label className={styles.label}>分类</label>
          <select className={styles.select} value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>权重 ({weight})</label>
          <input
            type="range"
            className={styles.range}
            min={1}
            max={10}
            value={weight}
            onChange={e => setWeight(Number(e.target.value))}
          />
        </div>
      </div>
      <div className={styles.row}>
        <label className={styles.label}>备注（推荐店铺等）</label>
        <input
          className={styles.input}
          value={remark}
          onChange={e => setRemark(e.target.value)}
          placeholder="可选"
        />
      </div>
      {!isEdit && (
        <div className={styles.row}>
          <label className={styles.label}>你的名字</label>
          <input
            className={styles.input}
            value={createdBy}
            onChange={e => setCreatedBy(e.target.value)}
            placeholder="匿名"
          />
        </div>
      )}
      <div className={styles.actions}>
        <button type="submit" className={styles.submitBtn} disabled={loading || !name.trim()}>
          {loading ? '提交中...' : isEdit ? '保存修改' : '添加菜品'}
        </button>
        {onCancel && (
          <button type="button" className={styles.cancelBtn} onClick={onCancel}>
            取消
          </button>
        )}
      </div>
    </form>
  );
}
