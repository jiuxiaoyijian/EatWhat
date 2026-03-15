import styles from './WeightBar.module.css';

interface Props {
  weight: number;
  max?: number;
}

export default function WeightBar({ weight, max = 10 }: Props) {
  const percent = (weight / max) * 100;
  const hue = 30 + (weight / max) * 20;

  return (
    <div className={styles.container}>
      <div
        className={styles.bar}
        style={{
          width: `${percent}%`,
          background: `hsl(${hue}, 95%, 55%)`,
        }}
      />
      <span className={styles.label}>{weight}</span>
    </div>
  );
}
