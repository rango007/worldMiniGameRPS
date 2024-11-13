// Contains the game logic (game flow, results)
import { Request, Response } from "express";
import { rtdb } from "../services/firebaseService"; // Firebase interaction functions

// Handle creating a new game room
export const createGameRoom = async (req: Request, res: Response) => {
  const { stackSize, betSize } = req.body;
  
  const newRoom = {
    stackSize,
    betSize,
    players: {},
    status: "open"
  };

  try {
    const newRoomRef = await rtdb.ref('gameRooms').push(newRoom);
    res.status(201).send({ roomId: newRoomRef.key, ...newRoom });
  } catch (error) {
    console.error("Error creating game room:", error);
    res.status(500).send("Error creating game room");
  }
};
