
//below it shows the winning posibilites 
//like across, a stright vertical, 
//and horizontal line

export const WIN_LINES = [
    [0, 1, 2], //this is the top row
    [3, 4, 5], //middle row
    [6, 7, 8], //bottom
    [0, 3, 6], //left column 
    [1, 4, 7], //middle column 
    [2, 5, 8], //right column 
    [0, 4, 8], //accross from left to right     
    [2, 4, 6], //across from right to left 
  ];
  
  //this checks to see if the winning comninations have happened 
  //if not then it return either human, ai, or null
  export function checkWinner(board) {
    for (let [a, b, c] of WIN_LINES) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]; //the winner 
      }
    }
    return null; //no winner found 
  }
  
  //this checks to see if all the cells in the board are fill and
  //also checks if there is a winner, if the cells are filled and there's no winner 
  //then it's a draw 
  export function isDraw(board) {
    return board.every((c) => c !== null) && !checkWinner(board);
  }
  
  //it returns an array of the cells that are still empty 
  export function getMoves(board) {
    return board
      .map((v, i) => (v === null ? i : null)) //it keeps tracks of the cells if they are empty
      .filter((v) => v !== null); //it removes the cells if it's not empty
  }
  
  //this creates a new board with the move already applied but it does not 
  //change the orginal board 
  export function apply(board, i, p) {
    const b = [...board]; //this is where it copies the board 
    b[i] = p; //this is where it puts either human or ai 
    return b;
  }
  
//Evaluation od AI and Human
//this is where it keeps score of the board 
//if the ai wins then +10, if the human wins then -10, and if it is a tie then 0
//this way we can tell at the end who won between the ai and the human 
  
  export function evaluate(board) {
    const w = checkWinner(board);
    if (w === "AI") return 10;
    if (w === "HUMAN") return -10;
    return 0;
  }
  
//Mini-Max 
// This is where ecursively explores all possible game states
// and the AI tries to MAXIMIZE score
// while the HUMAN tries to MINIMIZE score
  
  export function minimax(board, isMax, metrics) {
    metrics.nodes++; //here we are counting the nodes 
  
    //after the evaluation of the scores returns the score and the game stops
    const score = evaluate(board);
    if (score !== 0 || isDraw(board)) return score;
  

    if (isMax) {
        //the ai is the max player here
      let best = -Infinity;
  
      for (let m of getMoves(board)) {
        best = Math.max(
          best,
          minimax(apply(board, m, "AI"), false, metrics)
        );
      }
  
      return best;
    } else {
        //human is the min player here 
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
  
  
///ALPHA-BETA PRUNING 

//In this the alpha is the best move (value) Max ai can make 
//and the beta is the value (move) the Min human can make. 
//Since is alpha-beta pruning there are also nodes and leafes that do not affect the 
//final decision.
  export function alphaBeta(board, isMax, alpha, beta, metrics) {
    metrics.nodes++; //counts the nodes visited 
  
    const score = evaluate(board);
    if (score !== 0 || isDraw(board)) return score; ////after the evaluation of the scores returns the score and the game stops
  
    if (isMax) {
        //the ai is the max 
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
        alpha = Math.max(alpha, best); //this alpha update to the best the max can actually do
  
        //this is where the pruning happers because if it sees that Min has better options somewhere else then it stops searching 
        if (beta <= alpha) {
          metrics.pruned++;
          break;
        }
      }
  
      return best;
    } else {
      let best = Infinity;
  
      //This is the human turn as the minimizer 
      for (let m of getMoves(board)) {
        const val = alphaBeta(
          apply(board, m, "HUMAN"),
          true,
          alpha,
          beta,
          metrics
        );
  
        best = Math.min(best, val); 
        beta = Math.min(beta, best); //this alpha update to the best the max can actually do
  
        //this is where the pruning happers because if it sees that Max has better options somewhere else then it stops searching 
        if (beta <= alpha) {
          metrics.pruned++;
          break;
        }
      }
  
      return best;
    }
  }