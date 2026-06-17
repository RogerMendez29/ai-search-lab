import { useState } from "react";
import styles from "./TicTacToeUI.module.css";
import AiVsAiUI from "./ai_vs_ai/AiVsAiUI.jsx";
import HumanVsAi from "./human_vs_ai/HumanVsAi.jsx";

export default function TicTacToeUI() {
  const [mode, setMode] = useState("human_vs_ai");

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Tic-Tac-Toe AI Project</h2>

      {/* MODE SWITCH */}
      <div className={styles.modeRow}>
        <button
          onClick={() => setMode("human_vs_ai")}
          className={`${styles.modeButton} ${
            mode === "human_vs_ai"
              ? styles.modeButtonActive
              : styles.modeButtonInactive
          }`}
        >
          Human vs AI
        </button>

        <button
          onClick={() => setMode("ai_vs_ai")}
          className={`${styles.modeButton} ${
            mode === "ai_vs_ai"
              ? styles.modeButtonActive
              : styles.modeButtonInactive
          }`}
        >
          AI vs AI
        </button>
      </div>

      {/* MODE RENDER */}
      {mode === "ai_vs_ai" ? <AiVsAiUI /> : <HumanVsAi />}
    </div>
  );
}
