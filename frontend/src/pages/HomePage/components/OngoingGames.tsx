import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { rtdb } from "../../../services/firebaseConfig";

interface GameRoom {
  id: string;
  gameId: string;
  players: { nullifierHash: string; joinTime: string }[];
  createdAt: string;
}

interface OngoingGamesProps {
  userData?: { nullifierHash: string };
}

const OngoingGames: React.FC<OngoingGamesProps> = ({ userData }) => {
  const [ongoingGames, setOngoingGames] = useState<GameRoom[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const gameRoomsRef = ref(rtdb, "gameRooms");

    // Listen for updates in the gameRooms node
    const unsubscribe = onValue(gameRoomsRef, (snapshot) => {
      const games = snapshot.val();
      const activeGames: GameRoom[] = games
        ? Object.keys(games).map((id) => ({
            id,
            gameId: games[id].gameId,
            players: games[id].players || [],
            createdAt: games[id].createdAt,
          }))
        : [];
      setOngoingGames(activeGames);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const handlePlayGame = (gameRoomId: string) => {
    navigate(`/GameRoom?roomId=${gameRoomId}`);
  };

  return (
    <div className="ongoing-games">
      <h2>Ongoing Games</h2>
      {ongoingGames.length === 0 ? (
        <p>No ongoing games at the moment.</p>
      ) : (
        <ul>
          {ongoingGames.map((game) => (
            <li key={game.id} className="p-4 bg-gray-100 m-2 rounded shadow">
              <p>Game ID: {game.gameId}</p>
              <p>Started at: {new Date(game.createdAt).toLocaleString()}</p>
              <p>Players ({game.players.length}/2):</p>
              <ul className="ml-4 list-disc">
                {game.players.map((player) => (
                  <li key={player.nullifierHash}>
                    Player ID: {player.nullifierHash} (Joined: {new Date(player.joinTime).toLocaleTimeString()})
                  </li>
                ))}
              </ul>
              {userData && game.players.some((p) => p.nullifierHash === userData.nullifierHash) ? (
                <button
                  onClick={() => handlePlayGame(game.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded mt-2"
                >
                  Play
                </button>
              ) : (
                <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
                  Spectate
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OngoingGames;
