import { motion } from 'framer-motion';
import type { DrawResult } from '../../types';
import styles from './ResultDisplay.module.css';

interface Props {
  result: DrawResult;
  onReset: () => void;
  onGeneratePoster?: () => void;
}

export default function ResultDisplay({ result, onReset, onGeneratePoster }: Props) {
  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={styles.container}
    >
      <motion.div
        className={styles.card}
        animate={{ rotate: [0, -2, 2, -1, 1, 0] }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className={styles.badge}>{result.dish.category}</div>
        <motion.h2
          className={styles.dishName}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {result.dish.name}
        </motion.h2>
        <p className={styles.luckyText}>{result.luckyText}</p>
        {result.dish.remark && (
          <p className={styles.remark}>📍 {result.dish.remark}</p>
        )}
        <p className={styles.drawId}>抽取编号 #{result.historyId}</p>
      </motion.div>
      <div className={styles.actions}>
        <button className={styles.posterBtn} onClick={onGeneratePoster}>
          生成海报
        </button>
        <button className={styles.retryBtn} onClick={onReset}>
          再来一次
        </button>
      </div>
    </motion.div>
  );
}
