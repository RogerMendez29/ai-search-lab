import { useState } from "react";
import NavBar from "./components/NavBar.jsx";
import PuzzleUI from "./module_a/PuzzleUI.jsx";
import TicTacToeUI from "./module_b/TicTacToeUI.jsx";

function App() {
  const [activeModule, setActiveModule] = useState("a");

  return (
    <div>
      <NavBar activeModule={activeModule} onNavigate={setActiveModule} />
      <main>
        {activeModule === "a" && <PuzzleUI />}
        {activeModule === "b" && <TicTacToeUI />}
      </main>
    </div>
  );
}

export default App;
