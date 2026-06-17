//Win Login (I have to add comments)

export const WIN_LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  
  export function checkWinner(board) {
    for (let [a, b, c] of WIN_LINES) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }
  
  export function isDraw(board) {
    return board.every((c) => c !== null) && !checkWinner(board);
  }
  
  export function getMoves(board) {
    return board
      .map((v, i) => (v === null ? i : null))
      .filter((v) => v !== null);
  }
  
  export function apply(board, i, p) {
    const b = [...board];
    b[i] = p;
    return b;
  }
  
//Evaluation od AI and Human (I have to add comments)
  
  export function evaluate(board) {
    const w = checkWinner(board);
    if (w === "AI") return 10;
    if (w === "HUMAN") return -10;
    return 0;
  }
  
//Mini-Max (I have to add comments)
  
  export function minimax(board, isMax, metrics) {
    metrics.nodes++;
  
    const score = evaluate(board);
    if (score !== 0 || isDraw(board)) return score;
  
    if (isMax) {
      let best = -Infinity;
  
      for (let m of getMoves(board)) {
        best = Math.max(
          best,
          minimax(apply(board, m, "AI"), false, metrics)
        );
      }
  
      return best;
    } else {
      let best = Infinity;
  
      for (let m of getMoves(board)) {
        best = Math.min(
          best,
          minimax(apply(board, m, "HUMAN"), true, metrics)
        );
      }
  
      return best;
    }
  }
  
  
///ALPHA-BETA PRUNING (I have to add comments)
  
  
  export function alphaBeta(board, isMax, alpha, beta, metrics) {
    metrics.nodes++;
  
    const score = evaluate(board);
    if (score !== 0 || isDraw(board)) return score;
  
    if (isMax) {
      let best = -Infinity;
  
      for (let m of getMoves(board)) {
        const val = alphaBeta(
          apply(board, m, "AI"),
          false,
          alpha,
          beta,
          metrics
        );
  
        best = Math.max(best, val);
        alpha = Math.max(alpha, best);
  
        if (beta <= alpha) {
          metrics.pruned++;
          break;
        }
      }
  
      return best;
    } else {
      let best = Infinity;
  
      for (let m of getMoves(board)) {
        const val = alphaBeta(
          apply(board, m, "HUMAN"),
          true,
          alpha,
          beta,
          metrics
        );
  
        best = Math.min(best, val);
        beta = Math.min(beta, best);
  
        if (beta <= alpha) {
          metrics.pruned++;
          break;
        }
      }
  
      return best;
    }
  }