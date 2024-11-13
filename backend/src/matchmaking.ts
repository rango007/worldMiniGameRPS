import { ref, onChildAdded, set, remove, get, update } from "firebase/database";
import { rtdb } from "./services/firebaseConfig";

const MAX_PLAYERS_PER_ROOM = 2;

export const startMatchmaking = () => {
  const playersListRef = ref(rtdb, "playersList");

  // Listen for new players joining any game
  onChildAdded(playersListRef, async (snapshot) => {
    const newPlayer = snapshot.val();
    const { gameJoined } = newPlayer;

    if (!gameJoined) return;

    // Find players already waiting in this game in playersList
    const waitingPlayers = await findWaitingPlayers(gameJoined);

    if (waitingPlayers.length >= MAX_PLAYERS_PER_ROOM) {
      // Create game rooms in pairs of 2 players
      while (waitingPlayers.length >= MAX_PLAYERS_PER_ROOM) {
        const playersForRoom = waitingPlayers.splice(0, MAX_PLAYERS_PER_ROOM);

        // Generate a unique room ID for the game room
        const gameRoomId = `room_${gameJoined}_${Date.now()}`;
        const gameRoomRef = ref(rtdb, `gameRooms/${gameRoomId}`);

        // Create the game room with these players
        await set(gameRoomRef, {
          players: playersForRoom,
          gameId: gameJoined,
          createdAt: new Date().toISOString(),
        });

        // Add currentGames to users' data
        await Promise.all(playersForRoom.map(async (player) => {
          const userRef = ref(rtdb, `users/${player.nullifierHash}`);
          const userSnapshot = await get(userRef);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.val();
            const currentGames = userData.currentGames || []; // Ensure currentGames exists

            // Add the game room details to the currentGames array
            currentGames.push({
              gameRoomId,
              gameId: gameJoined,
              createdAt: new Date().toISOString(),
            });

            // Update the user's currentGames field in the users node
            await update(userRef, { currentGames });
          }
        }));

        // Remove these players from playersList
        await Promise.all(playersForRoom.map(player => {
          const playerRef = ref(rtdb, `playersList/${player.nullifierHash}_${player.joinTime}`);
          return remove(playerRef);
        }));
      }
    }
  });
};

// Helper function to find players waiting to join a specific game
const findWaitingPlayers = async (gameId: string) => {
  const playersListRef = ref(rtdb, "playersList");
  const playersSnapshot = await get(playersListRef);

  const waitingPlayers = [];
  playersSnapshot.forEach((childSnapshot) => {
    const playerData = childSnapshot.val();
    if (playerData.gameJoined === gameId) {
      // Include joinTime in the player data
      waitingPlayers.push({
        ...playerData,
        joinTime: childSnapshot.key.split('_')[1] // Extract joinTime from the Firebase path
      });
    }
  });

  return waitingPlayers;
};
