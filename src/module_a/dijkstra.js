/* Dijkstra's Algorithm for 8-Puzzle */
import {
  getSuccessors, //get valid next states from the current state
  isGoal, //check if the current state is the goal state
  stateToString, //convert the state to a string for easier comparison
} from "./puzzle.js";

//Priority Queue implementation using a Min Heap
class PriorityQueue {
  constructor() {
    this.elements = []; //array to hold all items
  }

  //Add an item with a priotiry to the queue
  enqueue(item, cost) {
    this.elements.push({ item, cost }); //add the item and its priority to the queue
    this.elements.sort((a, b) => a.cost - b.cost); //sort the queue based on priority, lowest first
  }

  //remove and return the item with the lowest cost
  dequeue() {
    return this.elements.shift().item; //remove from the front
  }

  //check if the queue is empty
  isEmpty() {
    return this.elements.length === 0; //queue is empty if there are no elements
  }
}

//Function to solve the puzzle using Dijkstra's Algorithm
export function solveDijkstra(initialState) {
  const startTime = performance.now(); //start timer to measure execution time

  //Priority queue to hold states to explore, ordered by cost
  const pq = new PriorityQueue();
  pq.enqueue({ state: initialState, path: [initialState] }, 0); //enqueue the initial state with a cost of 0

  //Set to keep track of visited states to avoid cycles
  const visited = new Set();

  //tracks the best known cost to reach each state
  const costMap = new Map();
  costMap.set(stateToString(initialState), 0); //cost to reach the initial state is 0

  let nodesExplored = 0; //counter for the number of nodes explored

  //Keep going as long as there are states to explore
  while (!pq.isEmpty()) {
    const { state, path, cost } = pq.dequeue(); //get the state with the lowest cost
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

    //Get the valid next states from the current state
    const successors = getSuccessors(state);

    for (const successor of successors) {
      const successorKey = stateToString(successor); //convert the successor state to a string for comparison
      const newCost = cost + 1; //cost to reach the successor is the current cost + 1 for the move

      //only add to queue if we haven't visited the successor or if we found a cheaper path to it
      if (
        !visited.has(successorKey) &&
        (!costMap.has(successorKey) || newCost < costMap.get(successorKey))
      ) {
        costMap.set(successorKey, newCost);
        pq.enqueue(
          { state: successor, path: [...path, successor], cost: newCost },
          newCost,
        );
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
