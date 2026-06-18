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

export function isDraw(board) {
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) return false;
  }
  return !checkWinner(board);
}

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
        best = Math.max(best, minimax(board, false, stats));
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
        alpha = Math.max(alpha, best);
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
        beta = Math.min(beta, best);
        if (beta <= alpha) break;
      }
    }
    return best;
  }
}

// Returns { move, timeMs, nodes } so the UI can display performance metrics
export function getBestMove(board, player, algo) {
  const tmpBoard = [...board];
  const isMaxsTurn = player === "X";
  const stats = { nodes: 0 };
  let bestScore = isMaxsTurn ? -Infinity : Infinity;
  let bestMove = -1;

  const start = performance.now();

  for (let i = 0; i < 9; i++) {
    if (tmpBoard[i] === null) {
      stats.nodes++;
      tmpBoard[i] = player;

      const score =
        algo === "alphabeta"
          ? alphabeta(tmpBoard, !isMaxsTurn, -Infinity, Infinity, stats)
          : minimax(tmpBoard, !isMaxsTurn, stats);

      tmpBoard[i] = null;

      if (
        (isMaxsTurn && score > bestScore) ||
        (!isMaxsTurn && score < bestScore)
      ) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  const timeMs = parseFloat((performance.now() - start).toFixed(2));

  return { move: bestMove, timeMs, nodes: stats.nodes };
}
