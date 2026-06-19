Project Members:

How to Run:

1. Download the zil file and extract to a folder in your computer
2. Open the extracted folder
3. Open terminal
4. Make sure to be on the root of the project "ai-search-lab"
5. run : npm install
6. run: npm run dev
7. click on the localhost link to open

Algorithms Implemented
Module A

- BFS: Uniformed searhc, explores level by level and guarantees shortest solution
- Dijkstra: Cost-based priority search, behavces like BFS, but guarantees the most oprimal solution
- A\*: Informed search using Manhattan Distance heruistic, it reduces the nodes explored while guaranteeing optimal solution

Module B

- Minimax: Adversarial search that evaluates all possible game outocmes to find the most optimal move
- Alpha-Beta Pruning: Minimax with pruning that eliminates branches that cannot affect the final decision

Comparative Analysis Report

Promt 1 - structural comparison:

Both modules can be represented as search trees where nodes are states and edges are actions. Both have a clearly defined initla state, a set of permitted movements and a termianl condition, The biggest difference is who controls the next movement.
In module a there is only one agent, so every movement is completed under the algorithm's or the player's controll.
In module B there are 2 agents with opposing goals. After MAX makes a movie, the MIN player tries to prevent MAX from winning, and viseversa. This males the problme from finidng a path to finding an strategy that guarantees the best outcome regardless of what the oppinetn does.

Promt 2 - Algorithm Fit

A* is well suited for Module A because the problem has a sinlge clear goal state, a measurable distance to the goal, and every move has a defined cost. These allows A* to estimate how far still needs to go and prioritize the most promising moves or brnahces. Module B cannot use A\* becuase there is no fixed goal state that can be measured. The outcome depends on what the opponent does.
Minimax does not apply to module A because Minimax assumes 2 alternative payes with opposing goals, since module a does not have an opponentm applyuing minimax will require creating an adversary that playes against you, which it does not make sense for a single player or single agent game mode.

Prompt 3 - Empirical Comparison Module A
Using the standarized Test Puzzle
BFS:
![BFS Results](<src/assets/Schreenshots/module_a_sc/BFS full result pic.png>)

Dijkstra:
![Dijkstra Results](<src/assets/Schreenshots/module_a_sc/Dijkstra full result.png>)

A*:
![A* Results](<src/assets/Schreenshots/module_a_sc/Astar full result.png>)

The contrast in between Dikstra's 5961 nodes and A*'s 77 nodes on the puzzle it was the most important result. Both alogiruthms found the identilca most optimlal 14-move solution. This demonstrates the value of the heurisitc information, without it, Dijkstra has no way to disntiguish the state that is getting closer to the goal or if it is moving away. A*'s manhattan distance heuristic is like a compass, that pulls the search towards the goial, ignoring the moves that makes it go a different direction other than the goal.

Prompt 4 - Empirical comparison Module B:

Prompt 5 - Trades off's Analysis:

Heruistic Information:
