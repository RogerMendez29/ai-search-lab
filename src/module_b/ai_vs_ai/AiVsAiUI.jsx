import { useState, useEffect, useRef } from "react";
import styles from "./AiVsAiUI.module.css";
import { getBestMove, checkWinner, isDraw } from "./AiVsAi.js";

// Theoretical plain-Minimax node baselines for a full drawn game. used to calculate pruning efficiency.
const MINIMAX_BASELINE = { x: 557000, o: 60000 };

export default function AiVsAiUI() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [ai1Algo, setAi1Algo] = useState("minimax");
  const [ai2Algo, setAi2Algo] = useState("minimax");
  const [whoseCurrentTurn, setWhoseCurrentTurn] = useState("X");
  const [isRunning, setIsRunning] = useState(false);
  const [dashAlgos, setDashAlgos] = useState({ x: null, o: null });
  const [decisionTimes, setDecisionTimes] = useState({ x: [], o: [] });
  const [nodesExplored, setNodesExplored] = useState({ x: 0, o: 0 });
  const timeoutRef = useRef(null);

  // These variables are re caulculated every time the board changes 
  const winner = checkWinner(board);
  const draw = isDraw(board);
  const gameOver = !!winner || draw;

  useEffect(() => { 
   
    if(gameOver){
      setIsRunning(false);
      return;
    }
    // This check is needed to prevent auto play from occurring before the start button is pressed.
    if(!isRunning) return;

    // This similuats a delay so we can see the AI making moves.
    timeoutRef.current = setTimeout(() => {
      const algo = whoseCurrentTurn === "X" ? ai1Algo : ai2Algo;
      const { move, timeMs, nodes } = getBestMove(board, whoseCurrentTurn, algo);
      if (move === -1) return;

      // used to to update the players stats 
      const key = whoseCurrentTurn === "X" ? "x" : "o";

      setDecisionTimes((oldObj) => {
        const updatedArray = [...oldObj[key],timeMs];
        return { ...oldObj, [key]: updatedArray };
      })

      setNodesExplored((oldObj) => {
        const updatedCount = oldObj[key] + nodes;
        return { ...oldObj, [key]: updatedCount };
      })

      const newBoard = [...board];
      newBoard[move] = whoseCurrentTurn;
      setBoard(newBoard);

      // After making a move, switch to the other player's turn.
      setWhoseCurrentTurn((prev) => (prev === "X" ? "O" : "X"));
    }, 600);

    return () => clearTimeout(timeoutRef.current);
  }, [isRunning, board, whoseCurrentTurn, gameOver, ai1Algo, ai2Algo]);


  function handleStart() {
    if (gameOver || isRunning) return;
    setDashAlgos({ x: ai1Algo, o: ai2Algo });
    setIsRunning(true);
  }

  /// Reset the game to its initial state.
  function handleReset() {
    // Clear any existing timeout
    clearTimeout(timeoutRef.current);
    setIsRunning(false);
    setBoard(Array(9).fill(null));
    setWhoseCurrentTurn("X");
    setDashAlgos({ x: null, o: null });
    setDecisionTimes({ x: [], o: [] });
    setNodesExplored({ x: 0, o: 0 });
  }

  /// Calculate the pruning efficiency of the Alpha-Beta algorithm.
  function getPruningEfficiency(player) {
    if (!gameOver || dashAlgos[player] !== "alphabeta") return "N/A";
    const baseline = MINIMAX_BASELINE[player];
    const saved = ((baseline - nodesExplored[player]) / baseline) * 100;
    return `${saved.toFixed(1)}%`;
  }

  function getStatus() {
    if (winner) return `${winner} wins!`;
    if (draw) return "It's a draw!";
    if (isRunning) return `${whoseCurrentTurn} is thinking...`;
    return "Press Start to begin";
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>AI vs AI</h2>

      <div className={styles.algoRow}>
        <div className={styles.algoSelector}>
          <label className={styles.label}>AI 1 (X)</label>
          <select
            value={ai1Algo}
            onChange={(e) => setAi1Algo(e.target.value)}
            className={styles.select}
            disabled={isRunning}
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
            disabled={isRunning}
          >
            <option value="minimax">Minimax</option>
            <option value="alphabeta">Alpha-Beta Pruning</option>
          </select>
        </div>
      </div>

      <p className={styles.status}>{getStatus()}</p>

      <div className={styles.board}>
        {board.map((element, index) => (
          <div
            key={index}
            className={`${styles.cell} ${element === "X" ? styles.cellX : element === "O" ? styles.cellO : ""}`}
          >
            {element}
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        <button
          onClick={handleStart}
          className={styles.startButton}
          disabled={isRunning || gameOver}
        >
          Start
        </button>
        <button onClick={handleReset} className={styles.resetButton}>
          Reset
        </button>
      </div>

      {/* AI (X)  Max Results */}
      <div className={styles.dashboard}>
        {/* AI (X) Max */}
        <div className={`${styles.dashCard} ${styles.dashCardX}`}>
          <h4 className={styles.dashCardTitle}>AI (X) Max</h4>
          <div className={styles.dashMetric}>
            <span className={styles.dashMetricLabel}>Algorithm</span>
            <span className={styles.dashMetricValue}>
              {dashAlgos.x ? (dashAlgos.x === "alphabeta" ? "Alpha-Beta" : "Minimax") : "--"}
            </span>
          </div>
          <div className={styles.dashMetric}>
            <span className={styles.dashMetricLabel}>Decision Time</span>
            <span className={styles.dashMetricValue}>
              {gameOver && decisionTimes.x.length > 0
                ? `${(decisionTimes.x.reduce((a, b) => a + b, 0) / decisionTimes.x.length).toFixed(2)} ms`
                : "--"}
            </span>
          </div>
          <div className={styles.dashMetric}>
            <span className={styles.dashMetricLabel}>Nodes Explored</span>
            <span className={styles.dashMetricValue}>
              {gameOver && nodesExplored.x > 0 ? nodesExplored.x.toLocaleString() : "--"}
            </span>
          </div>
          <div className={styles.dashMetric}>
            <span className={styles.dashMetricLabel}>Pruning Efficiency</span>
            <span className={styles.dashMetricValue}>
              {gameOver ? getPruningEfficiency("x") : "--"}
            </span>
          </div>
        </div>

        {/* AI (O) Min Results */}
        <div className={`${styles.dashCard} ${styles.dashCardO}`}>
          <h4 className={styles.dashCardTitle}>AI (O) Min</h4>
          <div className={styles.dashMetric}>
            <span className={styles.dashMetricLabel}>Algorithm</span>
            <span className={styles.dashMetricValue}>
              {dashAlgos.o ? (dashAlgos.o === "alphabeta" ? "Alpha-Beta" : "Minimax") : "--"}
            </span>
          </div>
          <div className={styles.dashMetric}>
            <span className={styles.dashMetricLabel}>Decision Time</span>
            <span className={styles.dashMetricValue}>
              {gameOver && decisionTimes.o.length > 0
                ? `${(decisionTimes.o.reduce((a, b) => a + b, 0) / decisionTimes.o.length).toFixed(2)} ms`
                : "--"}
            </span>
          </div>
          <div className={styles.dashMetric}>
            <span className={styles.dashMetricLabel}>Nodes Explored</span>
            <span className={styles.dashMetricValue}>
              {gameOver && nodesExplored.o > 0 ? nodesExplored.o.toLocaleString() : "--"}
            </span>
          </div>
          <div className={styles.dashMetric}>
            <span className={styles.dashMetricLabel}>Pruning Efficiency</span>
            <span className={styles.dashMetricValue}>
              {gameOver ? getPruningEfficiency("o") : "--"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
