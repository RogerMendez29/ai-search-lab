// App.jsx
// This is the main entry point of the application.
// Right now it just shows the 8-Puzzle module.
// Later we will add navigation between Module A and Module B.

import PuzzleUI from "./module_a/PuzzleUI.jsx";

function App() {
  return (
    <div>
      <PuzzleUI />
    </div>
  );
}

export default App;
