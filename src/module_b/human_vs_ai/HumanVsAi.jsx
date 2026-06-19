import { useEffect, useState } from "react";
import styles from "./HumanVsAi.module.css";

//This is to import all that I need from HumanVsAi.js 
import {
  checkWinner,
  isDraw,
  getMoves,
  apply,
  minimax,
  alphaBeta,
} from "./HumanVsAi.js";


export default function HumanVsAi() {

  //this is the game board that is 3 by 3 which is why is 9 arrays for either
  //the human, ai, or null
  const [board, setBoard] = useState(Array(9).fill(null));
  
  //if this is true then it is the turn of the human and if it is false then it is the ai's turn
  const [turn, setTurn] = useState(true);
  
  //this is to select wither the minimax or the alpha state 
  const [algo, setAlgo] = useState("minimax");

  //this is whether the game has ended 
  const [gameOver, setGameOver] = useState(false);

  // this is the stats of the ai displayed after everymove 
  const [metrics, setMetrics] = useState({
    nodes: 0, //the nodes explored
    pruned: 0, //the branches cut
    time: 0, //the time that it took to make the move 
  });

  // cumulative game stats shown at the end of the game
  const [gameMetrics, setGameMetrics] = useState({
    nodes: 0, //nodes explored 
    pruned: 0, //the branches cut
    time: 0, //the time it took overall for the entire game
  });

  //final stats shown at the end 
  const [finalStats, setFinalStats] = useState(null);

  //does not save multiples times for cleaner code
  const [finalSaved, setFinalSaved] = useState(false);

 //Game end check 
  useEffect(() => {

    //checks if someone has won the game or not or tied 
    const w = checkWinner(board);

    //the game ends if there is a winner of if the board is full 
    //and the ai and human tie the game
    if ((w || isDraw(board)) && !finalSaved) {
      setGameOver(true);

      //saves the final statistics of the game but only once for that game
      setFinalStats({
        nodes: gameMetrics.nodes,
        pruned: gameMetrics.pruned,
        time: gameMetrics.time.toFixed(2),
      });

      setFinalSaved(true);
    }
  }, [board]);

//when is the human turn

//a human cannot play if it is not their turn, if the board is full, or if the game 
//has already ended 
  function handleClick(i) {
    if (!turn || board[i] || gameOver) return;

    //apply only the human move 
    setBoard(apply(board, i, "HUMAN"));
    //this switches to false to return to the turn of the ai 
    setTurn(false);
  }

//when is the ai turn
  function aiMove() {
    const start = performance.now();

    let bestMove = null;
    let bestValue = -Infinity;

    //this is the local stats of how the ai plays (this is shown after each move of the ai)
    const local = { nodes: 0, pruned: 0 };

    //tries every possible move that it can play in the board 
    for (let m of getMoves(board)) {
      const newBoard = apply(board, m, "AI");

      //choose the algorithm dynamically 
      const val =
        algo === "minimax"
          ? minimax(newBoard, false, local)
          : alphaBeta(newBoard, false, -Infinity, Infinity, local);

          //this helps the ai keep track of the best move found 
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

    //apply the best move that was found by the ai
    setBoard(apply(board, bestMove, "AI"));
    //this switches the turn back to the human 
    setTurn(true);
  }

  //the auto ai trigger to go
  useEffect(() => {

    //if it is the ai turn and the game is not over then 
    if (!turn && !gameOver) {
      //a little delay to make it more natural like a human
      const t = setTimeout(aiMove, 300);
      return () => clearTimeout(t);
    }
  }, [turn, board, gameOver]);

//reset the game logic
  function reset() {
    //reset board 
    setBoard(Array(9).fill(null));
    //human starts again 
    setTurn(true);
    //clear the state of the current game 
    setGameOver(false);

    //it reset the live metrics 
    setMetrics({ nodes: 0, pruned: 0, time: 0 });

    //it resets the cumulative stats 
    setGameMetrics({ nodes: 0, pruned: 0, time: 0 });

    //clears the final stats
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

      {/* this is the live stats */}
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

      {/* this is the cumulative stats */}
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