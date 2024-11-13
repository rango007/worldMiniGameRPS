// backend/src/join-game.ts
import { Request, Response } from "express";
import { ref, get, update, set } from "firebase/database";
import { rtdb } from "./services/firebaseConfig";

export const joinGameHandler = async (req: Request, res: Response) => {
  const { nullifierHash, gameId, stackSize } = req.body;

  if (!nullifierHash || !gameId || stackSize === undefined) {
    return res.status(400).json({ success: false, message: "Invalid request data" });
  }

  try {
    // Reference to the user's data
    const userRef = ref(rtdb, `users/${nullifierHash}`);
    const userSnapshot = await get(userRef);

    if (!userSnapshot.exists()) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const userData = userSnapshot.val();
    const currentBalance = userData.walletBalance;

    if (currentBalance < stackSize) {
      return res.json({ success: false, message: "Insufficient balance to join the game" });
    }

    // Deduct stack size from balance and update in database
    const newBalance = currentBalance - stackSize;
    await update(userRef, { walletBalance: newBalance });

    // Add player entry to `playersList` with unique ID
    const playerEntryRef = ref(rtdb, `playersList/${nullifierHash}_${Date.now()}`);
    await set(playerEntryRef, {
      nullifierHash,
      gameJoined: gameId,
      dateTime: new Date().toISOString(),
    });

    return res.json({ success: true });
  } catch (error) {
    console.error("Error joining game:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
