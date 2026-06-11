import { useState } from "react";
import styles from "./AiVsAiUI.module.css";

export default function AiVsAiUI() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [ai1Algo, setAi1Algo] = useState("minimax");
  const [ai2Algo, setAi2Algo] = useState("minimax");

  function handleReset() {
    setBoard(Array(9).fill(null));
  }

  function handleStart() {
    // logic coming soon
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>AI vs AI</h2>

      {/* Algorithm selectors */}
      <div className={styles.algoRow}>
        <div className={styles.algoSelector}>
          <label className={styles.label}>AI 1 (X)</label>
          <select
            value={ai1Algo}
            onChange={(e) => setAi1Algo(e.target.value)}
            className={styles.select}
          >
            <option value="minimax">Minimax</option>
            <option value="alphabeta">Alpha-Beta Pruning</option>
          </select>
        </div>

        <span className={styles.vs}>vs</span>

        <div className={styles.algoSelector}>
          <label className={styles.label}>AI 2 (O)</label>
          <select
            value={ai2Algo}
            onChange={(e) => setAi2Algo(e.target.value)}
            className={styles.select}
          >
            <option value="minimax">Minimax</option>
            <option value="alphabeta">Alpha-Beta Pruning</option>
          </select>
        </div>
      </div>

      {/* 3x3 Board */}
      <div className={styles.board}>
        {board.map((cell, index) => (
          <div
            key={index}
            className={`${styles.cell} ${cell === "X" ? styles.cellX : cell === "O" ? styles.cellO : ""}`}
          >
            {cell}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <button onClick={handleStart} className={styles.startButton}>
          Start
        </button>
        <button onClick={handleReset} className={styles.resetButton}>
          Reset
        </button>
      </div>
    </div>
  );
}
