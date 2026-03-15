import { useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import type { DrawResult } from '../../types';
import styles from './PosterCanvas.module.css';

interface Props {
  result: DrawResult;
  onClose: () => void;
}

export default function PosterCanvas({ result, onClose }: Props) {
  const posterRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    if (!posterRef.current) return;
    const canvas = await html2canvas(posterRef.current, {
      scale: 2,
      backgroundColor: null,
      useCORS: true,
    });
    const link = document.createElement('a');
    link.download = `中午吃啥_${result.dish.name}_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [result.dish.name]);

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      return new Date().toLocaleString('zh-CN');
    }
    return d.toLocaleString('zh-CN');
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div ref={posterRef} className={styles.poster}>
          <div className={styles.posterBg}>
            <div className={styles.posterHeader}>
              <span className={styles.posterLogo}>🍜 中午吃啥</span>
            </div>
            <div className={styles.posterBody}>
              <span className={styles.posterCategory}>{result.dish.category}</span>
              <h2 className={styles.posterDishName}>{result.dish.name}</h2>
              <p className={styles.posterLucky}>{result.luckyText}</p>
              {result.dish.remark && (
                <p className={styles.posterRemark}>📍 {result.dish.remark}</p>
              )}
            </div>
            <div className={styles.posterFooter}>
              <span>#{result.historyId}</span>
              <span>{formatTime(result.dish.created_at)}</span>
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          <button className={styles.downloadBtn} onClick={handleDownload}>
            下载海报
          </button>
          <button className={styles.closeBtn} onClick={onClose}>
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
