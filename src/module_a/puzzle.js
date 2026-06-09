/**Foundation file, defines how the puzzle works
 * what state it's in, what moves are available, and if we have reached the goal
 */

//The GOAL state, the state we want to reach
export const GOAL_STATE = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 0],
];

//The initial state, the state we start in
//Standarized test puzzle for the assingment
export const INITIAL_STATE = [
  [8, 1, 3],
  [4, 0, 2],
  [7, 6, 5],
];

//Function to find the current location of the empty tile (0)
export function findBlank(state) {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (state[row][col] === 0) {
        return { row, col }; //found blank tile, return its position
      }
    }
  }
}

//Function to get sucessors, the possible moves from the current state
export function getSuccessors(state) {
  const successors = []; //will hold all valid next states
  const { row, col } = findBlank(state); //find the blank tile position

  //4 possible moves: up, down, left, right
  const directions = [
    [-1, 0], //blank tile UP
    [1, 0], //blank tile DOWN
    [0, -1], //blank tile LEFT
    [0, 1], //blank tile RIGHT
  ];

  for (const [rowChange, colChange] of directions) {
    const newRow = row + rowChange; // calculates the new row position after the move
    const newCol = col + colChange; // calculates the new column position after the move

    //Check if the new position is within the bounds of the puzzle
    if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3) {
      //Make a copy of the current state to not modify the original state
      const newState = state.map((r) => [...r]);
      //Swap the blank tile with the neighboring tile
      newState[row][col] = newState[newRow][newCol]; //Neighbor moves to blank spot
      newState[newRow][newCol] = 0; //Blank tile moves to neighbor's spot
      successors.push(newState); //Add the new state to the list of successors
    }
  }
  return successors;
}

//Function to check is the current state matches the GOAL state
export function isGoal(state) {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (state[row][col] !== GOAL_STATE[row][col]) {
        return false; //tile doesn't match the goal state, not a solution
      }
    }
  }
  return true; //all tiles match the goal state, we have a solution
}

/**function to convert the state into a string for easier comparison
 * since javaScript cant compare arrays by values.
 */
export function stateToString(state) {
  return state.flat().join(""); //flatten the 2D array and join with commas
}

//function to check if a state is solvable, based on the number of inversions
/*To check inversions you need to check eveyr pair and see if the number before
is bigger than the next, and count them, if the count is even, the state is solvable
if not then is unsolvable */
export function isSolvable(state) {
  const flat = state.flat().filter((n) => n !== 0); //flatten the state and remove the blank tile
  let inversions = 0; //counter for inversions

  for (let i = 0; i < flat.length; i++) {
    for (let j = i + 1; j < flat.length; j++) {
      if (flat[i] > flat[j]) {
        inversions++; //found an inversion, increment the counter
      }
    }
  }
  return inversions % 2 === 0; //if the number of inversions is even, the state is solvable
}

//fucntion for shuffle, it creates a random sobable puzzle state
export function shuffle() {
  const titles = [0, 1, 2, 3, 4, 5, 6, 7, 8]; //all 9 titles
  let shuffled;
  do {
    //Fisher-Yates shuffle algorithm to randomize the titles
    for (let i = titles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); //random index from 0 to i
      [titles[i], titles[j]] = [titles[j], titles[i]]; //swap titles
    }

    //Rebuild the 3x3 grid from the shuffled flat array
    shuffled = [
      [titles[0], titles[1], titles[2]],
      [titles[3], titles[4], titles[5]],
      [titles[6], titles[7], titles[8]],
    ];
  } while (!isSolvable(shuffled));

  return shuffled; //return the shuffled state, guaranteed to be solvable
}
