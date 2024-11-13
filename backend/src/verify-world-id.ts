// backend/src/verify-world-id.ts
import { Request, Response } from "express";
import { verifyCloudProof, IVerifyResponse } from "@worldcoin/minikit-js";

// The handler for the /api/verify-world-id route
export const verifyWorldIDHandler = async (req: Request, res: Response) => {
  const { proof, merkle_root, nullifier_hash, verification_level } = req.body;

  // Check if all required fields are present
  if (!proof || !merkle_root || !nullifier_hash || !verification_level) {
    return res.status(400).json({
      error: "Proof is incomplete, missing required fields.",
      details: {
        proof: !!proof,
        merkle_root: !!merkle_root,
        nullifier_hash: !!nullifier_hash,
        verification_level: !!verification_level,
      },
    });
  }

  console.log("Received proof:", proof);
  console.log("Merkle root:", merkle_root);
  console.log("Nullifier hash:", nullifier_hash);
  console.log("Verification level:", verification_level);

  try {
    const app_id = process.env.APP_ID as `app_${string}`; // Get your app_id from environment variables
    const verifyRes: IVerifyResponse = await verifyCloudProof(
      { proof, merkle_root, nullifier_hash, verification_level }, // Pass the payload directly
      app_id, // The app_id is used internally by the MiniKit API
      "sign-in-with-world-id" // The action ID you configured in your Worldcoin Developer Portal
    );

    console.log("Verification response from World ID:", verifyRes);

    if (verifyRes.success) {
      return res.json({ verified: true });
    } else {
      console.error("World ID verification failed:", verifyRes);
      return res.json({ verified: false });
    }
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
