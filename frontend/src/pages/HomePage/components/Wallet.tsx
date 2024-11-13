"use client";
import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { rtdb } from "../../../services/firebaseConfig";

interface WalletProps {
  userData: { walletBalance: number; nullifierHash: string };
}

const Wallet: React.FC<WalletProps> = ({ userData }) => {
  const [walletBalance, setWalletBalance] = useState<number>(userData.walletBalance);

  useEffect(() => {
    if (userData && userData.nullifierHash) {
      console.log("Setting up listener for wallet balance...");
      const walletRef = ref(rtdb, `users/${userData.nullifierHash}/walletBalance`);

      // Listen for changes in wallet balance in real-time
      const unsubscribe = onValue(walletRef, (snapshot) => {
        console.log("Listener triggered for wallet balance update");
        const newBalance = snapshot.val();
        console.log("New wallet balance from database:", newBalance);
        if (newBalance !== null) {
          setWalletBalance(newBalance); // Update wallet balance in UI
        }
      });

      // Cleanup the listener when the component unmounts or user data changes
      return () => unsubscribe();
    } else {
      console.log("UserData or nullifierHash is missing");
    }
  }, [userData?.nullifierHash]);

  return (
    <div className="wallet">
      <h2>Your Wallet</h2>
      <p>Current Wallet Balance: ${walletBalance !== null ? walletBalance : "Loading..."}</p>
    </div>
  );
};

export default Wallet;



/*
// sample code

import React, { useState } from "react";
import { MiniKit } from "@worldcoin/minikit-js";

const Wallet: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);

  const addFunds = async (amount: number) => {
    // Code to initiate transaction via Worldcoin MiniKit
    const payload = await MiniKit.commands.send({ amount });
    if (payload) {
      setBalance((prev) => prev + amount);
    }
  };

  const withdrawFunds = async (amount: number) => {
    // Code to handle withdrawal
    const response = await fetch("/api/wallet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "withdraw", amount }),
    });
    const result = await response.json();
    if (result.success) {
      setBalance((prev) => prev - amount);
    }
  };

  return (
    <div>
      <h2>Wallet Balance: {balance}</h2>
      <button onClick={() => addFunds(10)}>Add Funds</button>
      <button onClick={() => withdrawFunds(10)}>Withdraw</button>
    </div>
  );
};

export default Wallet;
*/