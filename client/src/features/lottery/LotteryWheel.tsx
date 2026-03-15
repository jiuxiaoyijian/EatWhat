import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import type { Dish, DrawResult } from '../../types';
import { drawLottery } from '../../api/dishes';
import ResultDisplay from './ResultDisplay';
import styles from './LotteryWheel.module.css';

interface Props {
  dishes: Dish[];
  onDrawComplete?: (result: DrawResult) => void;
  onGeneratePoster?: () => void;
}

type Phase = 'idle' | 'spinning' | 'result';

export default function LotteryWheel({ dishes, onDrawComplete, onGeneratePoster }: Props) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [displayName, setDisplayName] = useState('');
  const [result, setResult] = useState<DrawResult | null>(null);
  const spinTimer = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    spinTimer.current.forEach(clearTimeout);
    spinTimer.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const fireConfetti = () => {
    const count = 200;
    const defaults = { origin: { y: 0.7 }, zIndex: 1000 };
    confetti({ ...defaults, spread: 100, particleCount: count * 0.25, startVelocity: 55 });
    confetti({ ...defaults, spread: 60, particleCount: count * 0.2 });
    confetti({ ...defaults, spread: 120, particleCount: count * 0.35, decay: 0.91, scalar: 0.8 });
    confetti({ ...defaults, spread: 150, particleCount: count * 0.1, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  };

  const handleDraw = useCallback(async () => {
    if (phase !== 'idle' || dishes.length === 0) return;

    setPhase('spinning');
    clearTimers();

    const drawPromise = drawLottery();

    const names = dishes.map(d => d.name);
    let delay = 50;
    let step = 0;
    const totalSteps = 30;

    const animate = () => {
      if (step < totalSteps) {
        setDisplayName(names[step % names.length]);
        step++;
        delay += step * 4;
        const t = setTimeout(animate, delay);
        spinTimer.current.push(t);
      }
    };
    animate();

    try {
      const drawResult = await drawPromise;

      const waitForSpin = setTimeout(() => {
        setDisplayName(drawResult.dish.name);

        const showResult = setTimeout(() => {
          setResult(drawResult);
          setPhase('result');
          fireConfetti();
          onDrawComplete?.(drawResult);
        }, 400);
        spinTimer.current.push(showResult);
      }, Math.max(0, totalSteps * 80 - 500));
      spinTimer.current.push(waitForSpin);
    } catch {
      setPhase('idle');
      setDisplayName('');
    }
  }, [phase, dishes, clearTimers, onDrawComplete]);

  const handleReset = () => {
    setPhase('idle');
    setResult(null);
    setDisplayName('');
  };

  const noDishes = dishes.length === 0;

  return (
    <div className={styles.wrapper}>
      <AnimatePresence mode="wait">
        {phase === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={styles.center}
          >
            <p className={styles.hint}>
              {noDishes ? '还没有菜品，快去添加吧！' : `已收录 ${dishes.length} 道菜品`}
            </p>
            <button
              className={`${styles.drawBtn} ${noDishes ? styles.disabled : ''}`}
              onClick={handleDraw}
              disabled={noDishes}
            >
              <span className={styles.btnText}>开始随机</span>
              <span className={styles.btnSub}>点我决定今天吃啥</span>
            </button>
          </motion.div>
        )}

        {phase === 'spinning' && (
          <motion.div
            key="spinning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.center}
          >
            <motion.div
              className={styles.spinDisplay}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 0.3 }}
            >
              {displayName}
            </motion.div>
            <p className={styles.spinHint}>正在为你挑选...</p>
          </motion.div>
        )}

        {phase === 'result' && result && (
          <ResultDisplay result={result} onReset={handleReset} onGeneratePoster={onGeneratePoster} />
        )}
      </AnimatePresence>
    </div>
  );
}
