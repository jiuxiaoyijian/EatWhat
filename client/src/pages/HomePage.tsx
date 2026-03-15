import { useState, useEffect, useCallback } from 'react';
import type { Dish, DrawResult } from '../types';
import { getAllDishes } from '../api/dishes';
import LotteryWheel from '../features/lottery/LotteryWheel';
import PosterCanvas from '../features/poster/PosterCanvas';
import styles from './HomePage.module.css';

export default function HomePage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [lastResult, setLastResult] = useState<DrawResult | null>(null);
  const [showPoster, setShowPoster] = useState(false);

  useEffect(() => {
    getAllDishes().then(setDishes).catch(console.error);
  }, []);

  const handleDrawComplete = useCallback((result: DrawResult) => {
    setLastResult(result);
  }, []);

  const handleGeneratePoster = useCallback(() => {
    if (lastResult) setShowPoster(true);
  }, [lastResult]);

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.title}>今天中午吃什么？</h1>
        <p className={styles.subtitle}>让命运来决定吧！</p>
      </div>

      <LotteryWheel
        dishes={dishes}
        onDrawComplete={handleDrawComplete}
        onGeneratePoster={handleGeneratePoster}
      />

      {showPoster && lastResult && (
        <PosterCanvas result={lastResult} onClose={() => setShowPoster(false)} />
      )}
    </div>
  );
}
