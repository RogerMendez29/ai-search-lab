import styles from "./NavBar.module.css";

export default function NavBar({ activeModule, onNavigate }) {
  return (
    <nav className={styles.nav}>
      <span className={styles.brand}>AI Search Lab</span>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeModule === "a" ? styles.active : ""}`}
          onClick={() => onNavigate("a")}
        >
          Module A — 8-Puzzle
        </button>
        <button
          className={`${styles.tab} ${activeModule === "b" ? styles.active : ""}`}
          onClick={() => onNavigate("b")}
        >
          Module B — Tic-Tac-Toe
        </button>
      </div>
    </nav>
  );
}
