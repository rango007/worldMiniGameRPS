import { RequestHandler } from "express";
import fetch from "node-fetch";

// Define the expected response type
interface VerifyResponse {
  verified: boolean;
}

export const verifyWorldIDHandler: RequestHandler = async (req, res) => {
  const { proof } = req.body;

  try {
    const response = await fetch(
      `https://developer.worldcoin.org/api/v1/verify/app_21638d8d5ddc9f03f559537b2d83e90f`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...proof, action: "sign-in-with-world-id" }),
      }
    );

    if (response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        // Cast the response JSON to the VerifyResponse type
        const { verified } = (await response.json()) as VerifyResponse;
        res.status(200).json({ verified });
      } else {
        const textResponse = await response.text();
        console.error("Unexpected response format:", textResponse);
        res.status(500).json({ error: "Unexpected response format from World ID API" });
      }
    } else {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      res.status(response.status).json({ error: `Verification failed: ${errorText}` });
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ error: "Verification failed" });
  }
};
