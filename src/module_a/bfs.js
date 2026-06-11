//Breadth First Search
import {
  getSuccessors, //get valid next states from the current state
  isGoal, //check if the current state is the goal state
  stateToString, //convert the state to a string for easier comparison
  GOAL_STATE, //the target configuration we want to reach
} from "./puzzle.js";

//Fucntion to solve the puzzle using Breadth First Search
export function solveBFS(initialState) {
  const startTime = performance.now(); //start timer to measure execution time

  //The queue hold the states who need to explore and the path to reach those states
  const queue = [{ state: initialState, path: [initialState] }];

  //Set to keep track of visited states to avoid cycles
  const visited = new Set();
  visited.add(stateToString(initialState)); //mark the initial state as visited

  let nodesExplored = 0; //counter for the number of nodes explored

  while (queue.length > 0) {
    const { state, path } = queue.shift(); //shift from the top of the stack LIFO
    nodesExplored++; //increment the nodes explored counter
    //Check if we have reached the goal state
    if (isGoal(state)) {
      const endTime = performance.now(); //end timer
      return {
        solution: path, //the path to reach the solution
        nodesExplored, //number of nodes explored
        time: endTime - startTime, //execution time in milliseconds
      };
    }

    //Get the valid next states from the current state
    const successors = getSuccessors(state);
    //push each unvisited successor onto the stack
    for (const successor of successors) {
      const key = stateToString(successor); //convert the successor state to a string for comparison
      if (!visited.has(key)) {
        //check if the successor state has not been visited
        visited.add(key); //mark the successor state as visited
        queue.push({ state: successor, path: [...path, successor] }); //push the successor onto the stack with the updated path
      }
    }
  }

  //no solution was found
  const endTime = performance.now(); //end timer if no solution is found
  return {
    solution: null, //no solution found
    nodesExplored, //number of nodes explored
    time: endTime - startTime, //execution time in milliseconds
  };
}
