import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <NavLink to="/" className={styles.logo}>
          🍜 中午吃啥
        </NavLink>
        <div className={styles.links}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          >
            抽一个
          </NavLink>
          <NavLink
            to="/dishes"
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          >
            菜单
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          >
            记录
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
