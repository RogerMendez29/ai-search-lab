//A* algortuhm implementation for the 8-puzzle problem
import {
  getSuccessors, //get valid next states from the current state
  isGoal, //check if the current state is the goal state
  stateToString, //convert the state to a string for easier comparison
  GOAL_STATE, //the target configuration we want to reach
} from "./puzzle.js";

//Mnahattan distance heuristic function to estimate the cost to reach the goal state
function manhattanDistance(state) {
  let totalDistance = 0; //initialize total distance to 0
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const tile = state[row][col]; //get the tile number at the current position
      //Skip the black tile
      if (tile === 0) {
        continue;
      }
      //Find where the tile should be in the goal state
      for (let goalRow = 0; goalRow < 3; goalRow++) {
        for (let goalCol = 0; goalCol < 3; goalCol++) {
          if (GOAL_STATE[goalRow][goalCol] === tile) {
            //Calculate the Manhattan distance for this tile and add it to the total distance
            const distance = Math.abs(row - goalRow) + Math.abs(col - goalCol); //calculate the distance from the current position to the goal position
            totalDistance += distance; //add the distance for this tile to the total distance
          }
        }
      }
    }
  }

  return totalDistance; //return the total estimated distance to the goal state
}

//Priority Queue implementation using a Min Heap
class PriorityQueue {
  constructor() {
    this.items = []; //array to hold all items
  }

  //Add an item with a priotiry to the queue
  enqueue(item, priority) {
    this.items.push({ item, priority }); //add the item and its priority to the queue
    this.items.sort((a, b) => a.priority - b.priority); //sort the queue based on priority, lowest first
  }

  //remove and return the item with lowest priority
  dequeue() {
    return this.items.shift().item; //remove from the front
  }

  //Check if the queue is empty
  isEmpty() {
    return this.items.length === 0; //queue is empty if there are no items
  }
}

//Function to solve the puzzle using A* Search
export function solveAStar(initialState) {
  const startTime = performance.now(); //start timer to measure execution time

  //Calculate the initial heruistic value
  const initialH = manhattanDistance(initialState); //calculate the heuristic value for the initial state

  //Priority queue to hold states to explore, ordered by f(n) = g(n) + h(n)
  const pq = new PriorityQueue();
  pq.enqueue({ state: initialState, path: [initialState], g: 0 }, initialH); //enqueue the initial state with f(n) = h(n)

  //Visited set to avoid cycles
  const visited = new Set();

  //G score map to track the best known cost to reach each state
  const gScore = new Map();
  gScore.set(stateToString(initialState), 0); //cost to reach the initial state is 0

  let nodesExplored = 0; //counter for the number of nodes explored

  //Keep going as long as there are states to explore
  while (!pq.isEmpty()) {
    const { state, path, g } = pq.dequeue(); //get the state with the lowest f(n) value
    const key = stateToString(state); //convert the state to a string for comparison

    //Skip if we aleady visited the state
    if (visited.has(key)) {
      continue; //skip this state since it has already been visited
    }
    visited.add(key); //mark the state as visited
    nodesExplored++; //increment the nodes explored counter

    //Check if we found the goal
    if (isGoal(state)) {
      const endTime = performance.now(); //end timer
      return {
        solution: path, //the path to reach the solution
        nodesExplored, //number of nodes explored
        time: endTime - startTime, //execution time in milliseconds
      };
    }

    //Get valid next states from the current state
    const successors = getSuccessors(state);

    for (const successor of successors) {
      const successorKey = stateToString(successor); //convert the successor state to a string for comparison
      //g score for successor = current g + 1 move
      const newG = g + 1;

      //only explore if not visited and we found a better path
      if (
        (!visited.has(successorKey) && !gScore.has(successorKey)) ||
        newG < gScore.get(successorKey)
      ) {
        gScore.set(successorKey, newG); //update the best known g score for the successor
        //calculate h(n) for the successor
        const h = manhattanDistance(successor);
        //f(n) = g(n) + h(n)
        const f = newG + h;
        pq.enqueue(
          { state: successor, path: [...path, successor], g: newG },
          f,
        ); //enqueue the successor with its f(n) value
      }
    }
  }

  //No solution found
  const endTime = performance.now(); //end timer if no solution is found
  return {
    solution: null, //no solution found
    nodesExplored, //number of nodes explored
    time: endTime - startTime, //execution time in milliseconds
  };
}
