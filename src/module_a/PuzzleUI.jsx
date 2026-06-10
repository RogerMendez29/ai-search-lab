/*This is the visula interface for  module A: the 8 puzzle solver. 
It connects all algorithms files
it handles, display, and user interaction like shuffling and solving
*/

import { useState, useEffect } from "react";
import { solveDFS } from "./dfs.js";
import { solveDijkstra } from "./dijkstra.js";
import { solveAStar } from "./astar.js";
import { shuffle, INITIAL_STATE, isGoal } from "./puzzle.js";

export default function PuzzleUI() {
  //State variables that drive the UI

  //The current puzzle baord shown to the user
  const [board, setBoard] = useState(INITIAL_STATE);

  //Which algorithm the user selects in a dropdown menu
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("astar");

  //The full list of states form start to goal, the solution path
  const [solutionSteps, setSolutionSteps] = useState([]);

  //Which step fo the slution is currently showinng
  const [currentStep, setCurrentState] = useState(0);

  //Whether the solution is playing automatially
  const [isPlaying, setIsPlaying] = useState(false);

  //Whether the algorithm is currenlty running
  const [isSolving, setIsSolving] = useState(false);

  //whether to show the results popup
  const [showResults, setShowResults] = useState(false);

  //The performance metrics to show in the popup
  const [results, setResults] = useState(null);

  //status messga eshown bellow the puzzle
  const [statusMessage, setStatusMessage] = useState(
    "Shuffle the puzzle and picl and algorithm to solve it",
  );

  //Auto play, this advances the solution one step at a time until reaching the goal
  useEffect(() => {
    if (!isPlaying || solutionSteps.length === 0) {
      return;
    }
    //if we reached the last step, stop playing
    if (currentStep >= solutionSteps.length - 1) {
      setIsPlaying(false);
      setStatusMessage("Puzzle solved");
      setShowResults(true); //Show results in the popup
      return;
    }

    //Set a timer to advacce to the next step after a short delay
    const timer = setTimeout(() => {
      const nextStep = currentStep + 1; //calculate the next step index
      setCurrentState(nextStep);
      setBoard(solutionSteps[nextStep]); //update the board to show the next step
    }, 600); //delay in milliseconds between steps

    //Cleanup the timer if the component unmounts or if isPlaying changes
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, solutionSteps]);

  //function to hanfle shuffling the puzzle whne user clicks on it
  function handleShuffle() {
    const newBoard = shuffle(); //get a radnom solvable state
    setBoard(newBoard);
    setSolutionSteps([]); //clear previou ssolutions
    setCurrentState(0); //reset to the first step
    setIsPlaying(false);
    setShowResults(false);
    setResults(null);
    setStatusMessage("Puzzle shuffled. Pick an algorithm and hit solve");
  }

  //function that handles solving th epuzzle using the selected algorithm
  function handleSolve() {
    if (isGoal(board)) {
      setStatusMessage("Puzzle is already solved!");
      return;
    }

    setIsSolving(true);
    setStatusMessage("Solving...");
    setShowResults(false);

    setTimeout(() => {
      let result;

      //Run the selected algorithm
      if (selectedAlgorithm === "dfs") {
        result = solveDFS(board);
      } else if (selectedAlgorithm === "dijkstra") {
        result = solveDijkstra(board);
      } else {
        result = solveAStar(board);
      }

      setIsSolving(false); //hide loading state

      if (!result.solution) {
        setStatusMessage("No solution found, try shuffling again");
        return;
      }

      setSolutionSteps(result.solution);
      setCurrentState(0);
      //Store results in the popup
      setResults({
        algorithm: selectedAlgorithm.toUpperCase(),
        nodesExplored: result.nodesExplored,
        time: result.time.toFixed(2),
        solutionLength: result.solution.length - 1,
      });

      //Start playimg solution automatically
      setIsPlaying(true);
      setStatusMessage("Solution found! Playing steps...");
    }, 50); //small delay to let the UI update
  }

  //Fucntion to handle manual play of the puzzle
  function handleTileClick(row, col) {
    if (isPlaying || isSolving) {
      return; //disable manual moves while auto-playing or solving
    }

    //find the blank tile position
    let blankRow = -1;
    let blankCol = -1;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (board[r][c] === 0) {
          blankRow = r;
          blankCol = c;
        }
      }
    }

    //Check if the clicked tile is directly adjacent to the blank
    const isAdjacent =
      (Math.abs(row - blankRow) === 1 && col === blankCol) ||
      (Math.abs(col - blankCol) === 1 && row === blankRow);

    if (!isAdjacent) {
      return; //not a valid move if not adjacent
    }

    //swap the clicked tile with the blank
    const newBoard = board.map((r) => [...r]); //make a copy of the board
    newBoard[blankRow][blankCol] = board[row][col];
    newBoard[row][col] = 0; //move the blank to the clicked tile's position
    setBoard(newBoard); //update the board state

    //check if user solved it manually
    if (isGoal(newBoard)) {
      setStatusMessage("Congratulations! You solved the puzzle!");
    }
  }

  //Rendering, what is being shown on the screen
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>8-Puzzle Solver</h2>

      {/*Status message*/}
      <p style={styles.status}>{statusMessage}</p>

      {/*Puzzle Board*/}
      <div style={styles.board}>
        {board.map((row, rowIndex) =>
          row.map((tile, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleTileClick(rowIndex, colIndex)}
              style={{
                ...styles.tile,
                background: tile === 0 ? "#e0e0e0" : "#4a90d9",
                color: tile === 0 ? "transparent" : "white",
                cursor: tile === 0 ? "default" : "pointer",
              }}
            >
              {tile !== 0 ? tile : ""}
            </div>
          )),
        )}
      </div>

      {/*Controls*/}
      <div style={styles.controls}>
        {/*Algorithm dropdown*/}
        <select
          value={selectedAlgorithm}
          onChange={(e) => setSelectedAlgorithm(e.target.value)}
          style={styles.select}
          disabled={isPlaying || isSolving} //lock during solve
        >
          <option value="dfs">DFS</option>
          <option value="dijkstra">Dijkstra</option>
          <option value="astar">A*</option>
        </select>

        {/*Shuffle Button*/}
        <button
          onClick={handleShuffle}
          style={styles.button}
          disabled={isPlaying || isSolving}
        >
          Shuffle
        </button>

        {/*Solve Button*/}
        <button
          onClick={handleSolve}
          style={{ ...styles.button, background: "#27ae60" }}
          disabled={isPlaying || isSolving}
        >
          {isSolving ? "Solving..." : "Solve"}
        </button>
      </div>

      {/*Steps counter, it shows during animation*/}
      {solutionSteps.length > 0 && (
        <p style={styles.stepCounter}>
          Step {currentStep} of {solutionSteps.length - 1}
        </p>
      )}

      {/*Results Popup*/}
      {showResults && results && (
        <div style={styles.popup}>
          <h3 style={styles.popupTitle}> Solution Found!</h3>
          <p>Algorithm: {results.algorithm}</p>
          <p>Nodes Explored: {results.nodesExplored}</p>
          <p>Time taken: {results.time}</p>
          <p>Solution Length: {results.solutionLength}</p>
          <button onClick={() => setShowResults(false)} style={styles.button}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}

//Styling
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    fontFamily: "sans-serif",
  },
  title: {
    fontSize: "24px",
    marginBottom: "10px",
  },
  status: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "16px",
    height: "20px",
  },
  board: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 100px)", //3 Columns of 100px each
    gridTemplateRows: "repeat(3, 100px)",
    gap: "4px",
    marginBottom: "20px",
  },
  tile: {
    width: "100px",
    height: "100px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    fontWeight: "bold",
    borderRadius: "8px",
    userSelect: "none", //prevents text selection when clicking
  },
  controls: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginBottom: "16px",
  },
  select: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    cursor: "pointer",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    background: "#4a90d9",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  stepCounter: {
    fontSize: "14px",
    color: "#444",
  },
  popup: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    textAlign: "center",
    zIndex: 1000,
    minWidth: "250px",
  },
  popupTitle: {
    fontSize: "20px",
    marginBottom: "16px",
    color: "#27ae60",
  },
};
