// Entry point for the app, redirects to login or homepage
// sample code

import React, { useState } from "react";

const GameRoom: React.FC = () => {
  const [move, setMove] = useState<string>("");

  const handleMove = (chosenMove: string) => {
    setMove(chosenMove);
    // Send move to backend or opponent
  };

  return (
    <div>
      <h1>Rock-Paper-Scissors</h1>
      <div>
        <button onClick={() => handleMove("rock")}>Rock</button>
        <button onClick={() => handleMove("paper")}>Paper</button>
        <button onClick={() => handleMove("scissors")}>Scissors</button>
      </div>
      <p>Your move: {move}</p>
    </div>
  );
};

export default GameRoom;
