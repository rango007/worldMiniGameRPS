"use client";
import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";
import { useState } from "react";

const WorldIDSignIn = () => {
  const [isVerified, setIsVerified] = useState(false);

  const verifyProof = async (proof) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/verify-world-id`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ proof }),
          });
  
      if (response.ok) {
        const result = await response.json();
        if (result.verified) {
          setIsVerified(true);
          console.log("Verification successful!");
        } else {
          throw new Error("Verification failed");
        }
      } else {
        throw new Error(`API error: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Verification error:", error);
      alert("Verification failed, please try again.");
    }
  };
  

  return (
    <div>
      {!isVerified ? (
        <IDKitWidget
          app_id="app_21638d8d5ddc9f03f559537b2d83e90f"
          action="sign-in-with-world-id"
          verification_level={VerificationLevel.Device}
          handleVerify={verifyProof}
          onSuccess={() => setIsVerified(true)}
        >
          {({ open }) => (
            <button onClick={open} className="bg-blue-500 p-4 text-white">
              Verify with World ID
            </button>
          )}
        </IDKitWidget>
      ) : (
        <p>Verification complete. Welcome!</p>
      )}
    </div>
  );
};

export default WorldIDSignIn;
