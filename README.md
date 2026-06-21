# AI Search Lab

## Overview

AI Search Lab is an interactive web app that demonstrates two different families of AI search through two modules.

- **Module A – 8-Puzzle Solver:** a single-agent search problem where the goal is to slide tiles into order. It implements three solvers — BFS (uninformed), Dijkstra (cost-based), and A\* (informed, using the Manhattan distance heuristic) — and supports a default numbered puzzle, custom image puzzles, shuffling, manual play, and step-by-step solving.

- **Module B – Tic-Tac-Toe with AI:** an adversarial search problem played against an opponent. It implements Minimax and Alpha-Beta Pruning, and supports Human vs AI and AI vs AI modes with step-by-step move visualization. The performance dashboard updates independently for each mode — Human vs AI
  tracks the AI's decision metrics per move, while AI vs AI displays metrics
  for both agents separately.

## Project Members

Juan Diaz, Roger Mendez, Gabby

## How to Run

1. Download the zip file and extract it to a folder on your computer
2. Open the extracted folder
3. Open a terminal
4. Make sure you are in the root of the project "ai-search-lab"
5. Run: npm install
6. Run: npm run dev
7. Click on the localhost link to open

## Algorithms Implemented

### Module A (single-agent search)

- **BFS (uninformed):** explores level by level and guarantees the shortest solution
- **Dijkstra (cost-based):** uniform-cost priority search; behaves like BFS for unit-cost moves but guarantees the most optimal solution
- **A\* (informed):** uses the Manhattan distance heuristic to reduce the nodes explored while still guaranteeing an optimal solution

### Module B (adversarial search)

- **Minimax:** evaluates all possible game outcomes to find the most optimal move
- **Alpha-Beta Pruning:** Minimax with pruning that eliminates branches that cannot affect the final decision, reducing the number of nodes explored

## Architecture

### Tech stack

React 19 + Vite, written in plain JavaScript (JSX). Styling uses CSS Modules.

### Folder structure

```
ai-search-lab/
├── index.html               # Vite entry HTML, mounts the React app
├── package.json             # Dependencies and scripts (dev/build/lint)
├── vite.config.js           # Vite configuration
├── README.md
└── src/
    ├── main.jsx             # React entry point, renders <App>
    ├── App.jsx              # Single entry point: holds the active module and switches between A and B
    ├── components/
    │   └── NavBar.jsx       # Shared top navigation / tab switcher
    ├── module_a/            # 8-Puzzle: UI + algorithms
    │   ├── PuzzleUI.jsx     # Puzzle board, controls, and metrics display
    │   ├── puzzle.js        # Puzzle state, moves, shuffling, goal test
    │   ├── bfs.js           # BFS solver
    │   ├── dijkstra.js      # Dijkstra solver
    │   ├── astar.js         # A* solver (Manhattan distance heuristic)
    │   └── imageProcessor.js# Crops/slices an uploaded image into 3x3 tiles
    ├── module_b/            # Tic-Tac-Toe: UI + algorithms
    │   ├── TicTacToeUI.jsx  # Mode selector wrapping both game modes
    │   ├── human_vs_ai/     # Human vs AI mode (board UI + Minimax/Alpha-Beta logic)
    │   └── ai_vs_ai/        # AI vs AI auto-play mode (board UI + algorithm logic)
    └── assets/              # Images and report screenshots
```

## Comparative Analysis Report

### Prompt 1 - Structural comparison

Both modules can be represented as search trees where nodes are states and edges are actions. Both have a clearly defined initial state, a set of permitted movements, and a terminal condition. The biggest difference is who controls the next movement.
In Module A there is only one agent, so every movement is completed under the algorithm's or the player's control.
In Module B there are 2 agents with opposing goals. After MAX makes a move, the MIN player tries to prevent MAX from winning, and vice versa. This turns the problem from finding a path into finding a strategy that guarantees the best outcome regardless of what the opponent does.

### Prompt 2 - Algorithm Fit

A\* is well suited for Module A because the problem has a single clear goal state, a measurable distance to the goal, and every move has a defined cost. These allow A\* to estimate how far it still needs to go and prioritize the most promising moves or branches. Module B cannot use A\* because there is no fixed goal state that can be measured. The outcome depends on what the opponent does.
Minimax does not apply to Module A because Minimax assumes 2 alternating players with opposing goals. Since Module A does not have an opponent, applying Minimax would require creating an adversary that plays against you, which does not make sense for a single-player or single-agent game mode.

### Prompt 3 - Empirical Comparison Module A

Using the standardized Test Puzzle

BFS:
![BFS Results](<src/assets/Schreenshots/module_a_sc/BFS full result pic.png>)

Dijkstra:
![Dijkstra Results](<src/assets/Schreenshots/module_a_sc/Dijkstra full result.png>)

A*:
![A* Results](<src/assets/Schreenshots/module_a_sc/Astar full result.png>)

The contrast between Dijkstra's 5961 nodes and A\*'s 77 nodes on the puzzle was the most important result. Both algorithms found the identical, most optimal 14-move solution. This demonstrates the value of the heuristic information; without it, Dijkstra has no way to distinguish whether a state is getting closer to the goal or moving away from it. A\*'s Manhattan distance heuristic is like a compass that pulls the search toward the goal, ignoring the moves that take it in a different direction.

### Prompt 4 - Empirical comparison Module B

Minimax:
![Minimax Results](<src/assets/Schreenshots/module_b_sc/Minimax.png>)

Minimax with Alpha-beta:
![Alpha-beta Results](<src/assets/Schreenshots/module_b_sc/Alpha-beta.png>)

The results for the Minimax vs Alpha-beta were conclusive, minimax explored 59,704 nodes & took 14.40 ms, while Alpha-beta only had to explore 4,089 nodes & took 3.90 ms for its first move. That gives us a node-reduction efficiency of 93.15% — (59,704 − 4,089) / 59,704 — meaning Alpha-beta reached the same optimal move while skipping over 93% of the search. The app also reports a pruning efficiency of 37.83% for the Alpha-beta run, which is the share of its own explored nodes that were pruned (1,547 pruned / 4,089 explored). Both views confirm that pruning branches which cannot affect the final decision dramatically cuts the work without changing the result.

### Prompt 5 - Trade-offs Analysis

For Module A, `V` is the number of states (vertices) and `E` the number of moves between states (edges). For Module B, `b` is the branching factor and `m` the maximum depth of the game tree.

**Module A (single-agent search)**

- **BFS**
  - _Completeness:_ Complete — It will always find a solution if one exists.
  - _Optimality:_ It's Optimal when all moves cost the same, since the shallowest solution is then also the cheapest.
  - _Time Complexity:_ O(V + E) — BFS visits every state once and examines each move out of it.
  - _Space Complexity:_ O(V) — This is its main weakness, since every state must be held in memory.

**Dijkstra**

- _Completeness:_ Complete — It always finds a solution if one exists, as long as the move costs are non-negative.
- _Optimality:_ It's Optimal, since it always expands the lowest-cost node first.
- _Time Complexity:_ O((V + E) log V) — each state passes through a priority queue ordered by cost, since it has no heuristic to guide it.
- _Space Complexity:_ O(V) — This is its main weakness, since it must store all generated states ordered by cost.

**A\***

- _Completeness:_ Complete — It always finds a solution if one exists, if every node has a limited number of children.
- _Optimality:_ It's Optimal, since the Manhattan distance heuristic is admissible and never overestimates the true cost.
- _Time Complexity:_ O((V + E) log V) — this is the worst case, but the heuristic prunes many branches in practice, so it usually expands far fewer states.
- _Space Complexity:_ O(V) — This is its bottleneck, since it keeps all explored states in memory.

**Module B (adversarial search)**

**Minimax**

- _Completeness:_ Complete — It always finds a solution, since Tic-Tac-Toe is a finite game that always terminates.
- _Optimality:_ It's Optimal against an opponent who also plays optimally.
- _Time Complexity:_ O(b^m) — It evaluates every possible game outcome.
- _Space Complexity:_ O(b·m) — It explores depth-first and only stores the current path.

**Alpha-Beta Pruning**

- _Completeness:_ Complete — It always finds a solution, identical to Minimax.
- _Optimality:_ It's Optimal, returning the same move as Minimax.
- _Time Complexity:_ O(b^(m/2)) — With good move ordering it prunes branches without affecting the result.
- _Space Complexity:_ O(b·m) — This is the same as Minimax, since pruning cuts branches without adding storage.

### Heuristic Justification

Our A* solver uses the Manhattan distance heuristic, which adds up how many rows and columns each tile needs to travel to reach its correct position. We saw this pay off directly on our test puzzle — A* needed only 77 nodes to find the same optimal 14-move solution that Dijkstra took 5961 nodes to find. The reason it never overestimates is each slide moves exactly one tile, so the real number of moves can never be less than the total distance all tiles still need to travel. This means that the heuristic always stays at or below the true cost, which is what makes it admissible.
