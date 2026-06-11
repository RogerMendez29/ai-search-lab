import { useState } from "react";
import styles from "./TicTacToeUI.module.css";
import AiVsAiUI from "./ai_vs_ai/AiVsAiUI.jsx";

export default function TicTacToeUI() {
  const [mode, setMode] = useState("human_vs_ai");
  const [board, setBoard] = useState(Array(9).fill(null));

  function handleCellClick(index) {
    if (board[index]) return;
    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
  }

  function handleReset() {
    setBoard(Array(9).fill(null));
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Tic-Tac-Toe</h2>

      {/* Mode selector */}
      <div className={styles.modeRow}>
        <button
          onClick={() => { setMode("human_vs_ai"); handleReset(); }}
          className={`${styles.modeButton} ${mode === "human_vs_ai" ? styles.modeButtonActive : styles.modeButtonInactive}`}
        >
          Human vs AI
        </button>
        <button
          onClick={() => { setMode("ai_vs_ai"); handleReset(); }}
          className={`${styles.modeButton} ${mode === "ai_vs_ai" ? styles.modeButtonActive : styles.modeButtonInactive}`}
        >
          AI vs AI
        </button>
      </div>

      {mode === "ai_vs_ai" ? (
        <AiVsAiUI />
      ) : (
        <>
          <p className={styles.status}>Mode: Human vs AI</p>

          {/* 3x3 Board */}
          <div className={styles.board}>
            {board.map((cell, index) => (
              <div
                key={index}
                onClick={() => handleCellClick(index)}
                className={`${styles.cell} ${cell === "X" ? styles.cellX : cell === "O" ? styles.cellO : ""} ${cell ? styles.cellTaken : ""}`}
              >
                {cell}
              </div>
            ))}
          </div>

          {/* Reset button */}
          <button onClick={handleReset} className={styles.button}>
            Reset
          </button>
        </>
      )}
    </div>
  );
}
