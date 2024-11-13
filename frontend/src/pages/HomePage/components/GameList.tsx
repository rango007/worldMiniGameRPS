import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { rtdb } from "../../../services/firebaseConfig";

interface GameRoom {
  id: string;
  betSize: number;
  stackSize: number;
  name: string;
}

interface GameListProps {
  userData?: { walletBalance: number; nullifierHash: string };
}

const GameList: React.FC<GameListProps> = ({ userData }) => {
  const initialGameRooms: GameRoom[] = [
    { id: "room1", stackSize: 1, betSize: 0.2, name: "Room 1: $1 Stack, $0.2 Bet" },
    { id: "room2", stackSize: 10, betSize: 2, name: "Room 2: $10 Stack, $2 Bet" },
    { id: "room3", stackSize: 100, betSize: 20, name: "Room 3: $100 Stack, $20 Bet" },
    { id: "room4", stackSize: 500, betSize: 50, name: "Room 4: $500 Stack, $50 Bet" },
  ];

  const [gameRooms, setGameRooms] = useState(initialGameRooms);
  const [playerCounts, setPlayerCounts] = useState<{ [key: string]: number }>({});
  const [message, setMessage] = useState<string | null>(null);
  const [joinedGames, setJoinedGames] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (userData) {
      const playersListRef = ref(rtdb, "playersList");

      // Listen for changes in playersList to update player counts and joined games
      const unsubscribe = onValue(playersListRef, (snapshot) => {
        const playerEntries = snapshot.val();

        // Create a new player count for each room
        const newPlayerCounts: { [key: string]: number } = {};
        initialGameRooms.forEach((room) => {
          newPlayerCounts[room.id] = playerEntries
            ? Object.values(playerEntries).filter((entry: any) => entry.gameJoined === room.id).length
            : 0;
        });

        setPlayerCounts(newPlayerCounts);

        // Check if the current user has already joined any games
        const newJoinedGames = playerEntries
          ? Object.values(playerEntries).reduce((acc: any, entry: any) => {
              if (entry.nullifierHash === userData.nullifierHash) {
                acc[entry.gameJoined] = true; // Mark the game as joined
              }
              return acc;
            }, {})
          : {};

        setJoinedGames(newJoinedGames);
      });

      return () => unsubscribe(); // Clean up listener on component unmount
    }
  }, [userData]);

  const handleJoinGame = async (game: GameRoom) => {
    if (!userData || userData.walletBalance < game.stackSize) {
      setMessage("Insufficient wallet balance to join this game.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/join-game`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nullifierHash: userData.nullifierHash,
          gameId: game.id,
          stackSize: game.stackSize,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setMessage(`Successfully joined ${game.name}. Game will start shortly!`);
      } else {
        setMessage(result.message || "Failed to join the game.");
      }
    } catch (error) {
      console.error("Error joining game:", error);
      setMessage("Failed to join the game. Please try again.");
    }
  };

  return (
    <div className="game-list">
      <h2>Available Game Rooms</h2>
      {message && <p>{message}</p>}
      <ul>
        {gameRooms.map((room) => (
          <li key={room.id} className="p-4 bg-gray-100 m-2 rounded shadow">
            <p>{room.name}</p>
            <p>Bet Size: ${room.betSize}</p>
            <p>Stack Size: ${room.stackSize}</p>
            <p>Players: {playerCounts[room.id] || 0}/2</p>
            <button
              onClick={() => handleJoinGame(room)}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              disabled={
                !userData ||
                userData.walletBalance < room.stackSize ||
                (playerCounts[room.id] || 0) >= 2 ||
                joinedGames[room.id] // Disable if user has already joined
              }
            >
              {joinedGames[room.id] ? "Already Joined" : "Join Game"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GameList;
