import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage/index";
import GameRoom from "./GameRoom/index";

export default function App() {
  return (
    <Router>
      <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-y-3">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/GameRoom" element={<GameRoom />} />
        </Routes>
      </main>
    </Router>
  );
}
