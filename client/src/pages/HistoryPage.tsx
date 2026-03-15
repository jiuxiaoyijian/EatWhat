import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LotteryHistory } from '../types';
import { getLotteryHistory } from '../api/dishes';
import styles from './HistoryPage.module.css';

export default function HistoryPage() {
  const [history, setHistory] = useState<LotteryHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLotteryHistory(100)
      .then(setHistory)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) return `今天 ${d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`;
    return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <div className={styles.loading}>加载中...</div>;
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>抽取记录</h2>
      <p className={styles.subtitle}>共 {history.length} 次抽取</p>

      {history.length === 0 ? (
        <div className={styles.empty}>
          <p>还没有抽取记录</p>
          <p>去首页试试手气吧！</p>
        </div>
      ) : (
        <div className={styles.list}>
          <AnimatePresence>
            {history.map((item, index) => (
              <motion.div
                key={item.id}
                className={styles.item}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <div className={styles.itemLeft}>
                  <span className={styles.itemIndex}>#{item.id}</span>
                  <div>
                    <h4 className={styles.itemName}>{item.dish_name}</h4>
                    <p className={styles.itemLucky}>{item.lucky_text}</p>
                  </div>
                </div>
                <span className={styles.itemTime}>{formatTime(item.drawn_at)}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
