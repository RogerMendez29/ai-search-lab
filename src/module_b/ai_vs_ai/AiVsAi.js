


/*
 * AI vs AI Game Logic
 * This module contains the core game logic for the AI vs AI game.
 * board is a 1D array of 9 elements, each element is either "X", "O", or null.
 * stats is an object that tracks the number of nodes explored and the decision time.
 */

// A 2D array that defines the winnable conditions of the game
const WIN_LINES = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // middle column
  [2, 5, 8], // right column
  [0, 4, 8], // diagonal top-left to bottom-right
  [2, 4, 6], // diagonal top-right to bottom-left
];


// returns the winner of the game (X, O, or null)
export function checkWinner(board) {
  for (const line of WIN_LINES) {
    const a = line[0];
    const b = line[1];
    const c = line[2];

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

// returns true if the game is a draw, false otherwise
export function isDraw(board) {
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) return false;
  }
  return !checkWinner(board);
}

// Returns the best move for the given player using the Minimax algorithm
function minimax(board, isMaxsTurn, stats) {
  stats.nodes++;

  const winner = checkWinner(board);
  if (winner === "X") return 1;
  if (winner === "O") return -1;
  if (isDraw(board)) return 0;

  if (isMaxsTurn) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = "X";
        // Recursively calls minimax for the next player in order to get the best score for the current player
        best = Math.max(best, minimax(board, false, stats));
        // Undo the move to check the next possible move
        board[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = "O";
        best = Math.min(best, minimax(board, true, stats));
        board[i] = null;
      }
    }
    return best;
  }
}

// Returns the best move for the given player using the Alpha-Beta pruning algorithm
function alphabeta(board, isMaxsTurn, alpha, beta, stats) {
  stats.nodes++;

  const winner = checkWinner(board);
  if (winner === "X") return 1;
  if (winner === "O") return -1;
  if (isDraw(board)) return 0;

  if (isMaxsTurn) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = "X";
        best = Math.max(best, alphabeta(board, false, alpha, beta, stats));
        board[i] = null;

        // Max chooses the best score for alpha 
        alpha = Math.max(alpha, best);
        // If beta is less than or equal to alpha, we can prune the remaining branches
        if (beta <= alpha) break;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = "O";
        best = Math.min(best, alphabeta(board, true, alpha, beta, stats));
        board[i] = null;
        // Min chooses the best score for beta
        beta = Math.min(beta, best);
        // If beta is less than or equal to alpha, we can prune the remaining branches
        if (beta <= alpha) break;
      }
    }
    return best;
  }
}

// Returns an object with the index of the best move, the time it took to find it, and the number of nodes explored.
export function getBestMove(board, player, algo) {
  // Create a copy of the board to avoid modifying the original
  const tmpBoard = [...board];
  const isMaxsTurn = player === "X";
  const stats = { nodes: 0 };
  let bestScore = isMaxsTurn ? -Infinity : Infinity;
  let bestMove = -1;

  // returns a time in milliseconds
  const start = performance.now();

  for (let i = 0; i < 9; i++) {
    if (tmpBoard[i] === null) {
      tmpBoard[i] = player;

      const score =
        algo === "alphabeta"
          ? alphabeta(tmpBoard, !isMaxsTurn, -Infinity, Infinity, stats)
          : minimax(tmpBoard, !isMaxsTurn, stats);

      tmpBoard[i] = null;

      // Updating the best score and move depending on the current player
      if ((isMaxsTurn && score > bestScore) ||(!isMaxsTurn && score < bestScore)) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  // Calculates the time it took to find the best move
  const timeMs = parseFloat((performance.now() - start).toFixed(2));

  return { move: bestMove, timeMs, nodes: stats.nodes };
}
