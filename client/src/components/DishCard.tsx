import { motion } from 'framer-motion';
import type { Dish } from '../types';
import WeightBar from './WeightBar';
import styles from './DishCard.module.css';

interface Props {
  dish: Dish;
  onEdit: (dish: Dish) => void;
  onDelete: (id: number) => void;
}

export default function DishCard({ dish, onEdit, onDelete }: Props) {
  return (
    <motion.div
      className={styles.card}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.25 }}
    >
      <div className={styles.header}>
        <span className={styles.category}>{dish.category}</span>
        <div className={styles.actions}>
          <button className={styles.editBtn} onClick={() => onEdit(dish)} title="编辑">
            ✏️
          </button>
          <button className={styles.deleteBtn} onClick={() => onDelete(dish.id)} title="删除">
            🗑️
          </button>
        </div>
      </div>
      <h3 className={styles.name}>{dish.name}</h3>
      <div className={styles.weight}>
        <span className={styles.weightLabel}>权重</span>
        <WeightBar weight={dish.weight} />
      </div>
      {dish.remark && <p className={styles.remark}>📍 {dish.remark}</p>}
      <div className={styles.meta}>
        <span>{dish.created_by}</span>
      </div>
    </motion.div>
  );
}
