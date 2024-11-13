// Entry point for the app, redirects to login or homepage
// pages/HomePage/index.tsx
"use client";
import { useState, useEffect } from "react";
import WorldIDSignIn from "./components/WorldIDSignIn";
import Wallet from "./components/Wallet";
import GameList from "./components/GameList";
import OngoingGames from "./components/OngoingGames";
import { rtdb } from "../../services/firebaseConfig";
import { ref, get, set, onValue } from "firebase/database";

export default function HomePage() {
  const [isVerified, setIsVerified] = useState(false);
  const [userData, setUserData] = useState<{ walletBalance: number; nullifierHash: string } | null>(null);

  // Fetch user data and set up a real-time listener for walletBalance
  const fetchUserData = async (nullifierHash: string) => {
    try {
      const userRef = ref(rtdb, `users/${nullifierHash}`);
      const userSnapshot = await get(userRef);

      if (userSnapshot.exists()) {
        const userInfo = { ...userSnapshot.val(), nullifierHash };
        setUserData(userInfo);
        setIsVerified(true);

        // Set up a real-time listener for walletBalance updates
        const balanceRef = ref(rtdb, `users/${nullifierHash}/walletBalance`);
        onValue(balanceRef, (snapshot) => {
          const updatedBalance = snapshot.val();
          setUserData((prevData) => prevData ? { ...prevData, walletBalance: updatedBalance } : prevData);
        });

      } else {
        const defaultData = { walletBalance: 0 };
        await set(userRef, defaultData);
        setUserData({ ...defaultData, nullifierHash });
        setIsVerified(true);
      }
    } catch (error) {
      console.error("Error fetching or creating user data:", error);
    }
  };

  const handleVerification = (nullifierHash: string, worldIDResponse: object) => {
    console.log("World ID Response:", worldIDResponse);
    setIsVerified(true);
    fetchUserData(nullifierHash);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-y-3">
      {!isVerified ? (
        <WorldIDSignIn onVerified={handleVerification} />
      ) : userData ? (
        <>
          <Wallet userData={userData} />
          <OngoingGames userData={userData} walletBalance={userData.walletBalance} />
          <GameList userData={userData} walletBalance={userData.walletBalance} />
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </main>
  );
}
/*
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WorldIDSignIn from "./components/WorldIDSignIn";
import Wallet from "./components/Wallet";
import GameList from "./components/GameList";
import { rtdb } from "../../services/firebaseConfig"; // Use Realtime Database
import { ref, get, set, update } from "firebase/database";

export default function HomePage() {
  const [isVerified, setIsVerified] = useState(false);
  const [userData, setUserData] = useState<{ walletBalance: number; nullifierHash: string } | null>(null);
  const navigate = useNavigate();

  // Fetch user data from Realtime Database
  const fetchUserData = async (nullifierHash: string) => {
    try {
      const userRef = ref(rtdb, `users/${nullifierHash}`);
      const userSnapshot = await get(userRef);

      if (userSnapshot.exists()) {
        setUserData({ ...userSnapshot.val(), nullifierHash });
        setIsVerified(true);
      } else {
        const defaultData = { walletBalance: 0 };
        await set(userRef, defaultData);
        setUserData({ ...defaultData, nullifierHash });
        setIsVerified(true);
      }
    } catch (error) {
      console.error("Error fetching or creating user data:", error);
    }
  };

  // Check if the user is part of a game room and redirect if so
  useEffect(() => {
    if (!userData) return;

    const checkCurrentGames = async () => {
      // Fetch the user's data from Firebase to check their current games
      const userRef = ref(rtdb, `users/${userData.nullifierHash}`);
      const userSnapshot = await get(userRef);

      if (userSnapshot.exists()) {
        const user = userSnapshot.val();
        const currentGames = user.currentGames || [];

        if (currentGames.length > 0) {
          // User is part of a game room, redirect to the first game room
          const firstGameRoom = currentGames[0];
          console.log(`User is part of a game room, redirecting to GameRoom with roomId: ${firstGameRoom.gameRoomId}`);
          navigate(`/GameRoom?roomId=${firstGameRoom.gameRoomId}`);
        }
      }
    };

    checkCurrentGames();
  }, [userData, navigate]);

  const handleVerification = (nullifierHash: string, worldIDResponse: object) => {
    console.log("World ID Response:", worldIDResponse);
    setIsVerified(true);
    fetchUserData(nullifierHash);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-y-3">
      {!isVerified ? (
        <WorldIDSignIn onVerified={handleVerification} />
      ) : userData ? (
        <>
          <Wallet userData={userData} />
          <GameList userData={userData} walletBalance={userData.walletBalance} />
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </main>
  );
}

*/

