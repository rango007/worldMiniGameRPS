"use client";
// pages/HomePage/components/WorldIDSignIn.tsx
"use client";
import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";
import { useState } from "react";

interface WorldIDSignInProps {
  onVerified: (nullifierHash: string, worldIDResponse: object) => void;
}

const WorldIDSignIn: React.FC<WorldIDSignInProps> = ({ onVerified }) => {
  const [isVerifying, setIsVerifying] = useState(false);

  const verifyProof = async (proof: string, merkle_root: string, nullifier_hash: string, verification_level: string) => {
    console.log("Sending proof:", proof);
    console.log("Sending merkle_root:", merkle_root);
    console.log("Sending nullifier_hash:", nullifier_hash);
    console.log("Sending verification_level:", verification_level);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/verify-world-id`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proof, merkle_root, nullifier_hash, verification_level }),
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        console.log("Verification response:", result);

        if (result.verified) {
          console.log("Verification successful!");
          onVerified(nullifier_hash, result); // Pass nullifier_hash and response
        } else {
          console.error("Verification failed:", result);
        }
      } else {
        const text = await response.text();
        console.error("Non-JSON response received:", text);
      }
    } catch (error) {
      console.error("Verification error:", error);
    }
  };

  return (
    <div>
      <IDKitWidget
        app_id="app_21638d8d5ddc9f03f559537b2d83e90f"
        action="sign-in-with-world-id"
        verification_level={VerificationLevel.Device} // Use "Device" or "Orb" based on the desired level
        handleVerify={(data) => {
          console.log("Verification data:", data); 
          verifyProof(data.proof, data.merkle_root, data.nullifier_hash, data.verification_level); // Adjusted to include correct fields
        }}
      >
        {({ open }: { open: () => void }) => (
          <button
            onClick={open}
            className="bg-blue-500 p-4 text-white"
            disabled={isVerifying}
          >
            {isVerifying ? "Verifying..." : "Verify with World ID"}
          </button>
        )}
      </IDKitWidget>
    </div>
  );
};

export default WorldIDSignIn;
