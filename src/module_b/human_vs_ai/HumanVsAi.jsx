import { useEffect, useState } from "react";
import styles from "./HumanVsAi.module.css";

import {
  checkWinner,
  isDraw,
  getMoves,
  apply,
  minimax,
  alphaBeta,
} from "./HumanVsAi.js";

export default function HumanVsAi() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState(true);
  const [algo, setAlgo] = useState("minimax");
  const [gameOver, setGameOver] = useState(false);

  // per-move stats (display only)
  const [metrics, setMetrics] = useState({
    nodes: 0,
    pruned: 0,
    time: 0,
  });

  // cumulative game stats (correct)
  const [gameMetrics, setGameMetrics] = useState({
    nodes: 0,
    pruned: 0,
    time: 0,
  });

  const [finalStats, setFinalStats] = useState(null);
  const [finalSaved, setFinalSaved] = useState(false);

 //Game end check (I have to add comments)
  useEffect(() => {
    const w = checkWinner(board);

    if ((w || isDraw(board)) && !finalSaved) {
      setGameOver(true);

      setFinalStats({
        nodes: gameMetrics.nodes,
        pruned: gameMetrics.pruned,
        time: gameMetrics.time.toFixed(2),
      });

      setFinalSaved(true);
    }
  }, [board]);

//when is the human turn
  function handleClick(i) {
    if (!turn || board[i] || gameOver) return;

    setBoard(apply(board, i, "HUMAN"));
    setTurn(false);
  }

//when is the ai turn
  function aiMove() {
    const start = performance.now();

    let bestMove = null;
    let bestValue = -Infinity;

    const local = { nodes: 0, pruned: 0 };

    for (let m of getMoves(board)) {
      const newBoard = apply(board, m, "AI");

      const val =
        algo === "minimax"
          ? minimax(newBoard, false, local)
          : alphaBeta(newBoard, false, -Infinity, Infinity, local);

      if (val > bestValue) {
        bestValue = val;
        bestMove = m;
      }
    }

    const end = performance.now();
    const duration = end - start;

    // per-move stats
    setMetrics({
      nodes: local.nodes,
      pruned: local.pruned,
      time: duration.toFixed(2),
    });

    //cumulative game stats at the end
    setGameMetrics((prev) => ({
      nodes: prev.nodes + local.nodes,
      pruned: prev.pruned + local.pruned,
      time: prev.time + duration,
    }));

    setBoard(apply(board, bestMove, "AI"));
    setTurn(true);
  }

  //the auto ai trigger to go
  useEffect(() => {
    if (!turn && !gameOver) {
      const t = setTimeout(aiMove, 300);
      return () => clearTimeout(t);
    }
  }, [turn, board, gameOver]);

//reset the game logic
  function reset() {
    setBoard(Array(9).fill(null));
    setTurn(true);
    setGameOver(false);

    setMetrics({ nodes: 0, pruned: 0, time: 0 });

    setGameMetrics({ nodes: 0, pruned: 0, time: 0 });

    setFinalStats(null);
    setFinalSaved(false);
  }

//UI
  return (
    <div className={styles.container}>
      <div className={styles.title}>Human vs AI</div>

      <div className={styles.controls}>
        <select
          value={algo}
          onChange={(e) => setAlgo(e.target.value)}
          className={styles.select}
        >
          <option value="minimax">Minimax</option>
          <option value="alphabeta">Alpha-Beta</option>
        </select>

        <button className={styles.resetButton} onClick={reset}>
          Reset
        </button>
      </div>

      <h3>
        {gameOver
          ? "Game Over"
          : turn
          ? "Your Turn (X)"
          : "AI Thinking (O)"}
      </h3>

      <div className={styles.board}>
        {board.map((c, i) => (
          <div
            key={i}
            onClick={() => handleClick(i)}
            className={`${styles.cell} ${
              c === "HUMAN"
                ? styles.cellX
                : c === "AI"
                ? styles.cellO
                : ""
            }`}
          >
            {c === "HUMAN" ? "X" : c === "AI" ? "O" : ""}
          </div>
        ))}
      </div>

      {/* LIVE STATS */}
      <div style={{ marginTop: 20 }}>
        <p>Nodes: {metrics.nodes}</p>
        <p>Pruned: {metrics.pruned}</p>
        <p>Time: {metrics.time} ms</p>

        {algo === "alphabeta" && metrics.nodes > 0 && (
          <p>
            Efficiency:{" "}
            {((metrics.pruned / metrics.nodes) * 100).toFixed(2)}%
          </p>
        )}
      </div>

      {/* FINAL STATS (FULL GAME) */}
      {gameOver && finalStats && (
        <div style={{ marginTop: 30 }}>
          <h3>Final Statistics (Full Game)</h3>

          <p>Nodes explored: {finalStats.nodes}</p>
          <p>Pruned: {finalStats.pruned}</p>
          <p>Time: {finalStats.time} ms</p>

          <p>
            Efficiency:{" "}
            {finalStats.nodes
              ? (
                  (finalStats.pruned / finalStats.nodes) *
                  100
                ).toFixed(2)
              : 0}
            %
          </p>
        </div>
      )}
    </div>
  );
}