// sample code

import { db } from "../../index";
import { Request, Response } from "express";

export const handleDeposit = async (req: Request, res: Response) => {
  const { userId, amount } = req.body;
  // Update user wallet in Firestore
  await db.collection("users").doc(userId).update({
    balance: admin.firestore.FieldValue.increment(amount),
  });
  res.status(200).json({ success: true });
};

export const handleWithdrawal = async (req: Request, res: Response) => {
  const { userId, amount } = req.body;
  const userRef = db.collection("users").doc(userId);
  const user = await userRef.get();
  if (user.data()?.balance >= amount) {
    await userRef.update({
      balance: admin.firestore.FieldValue.increment(-amount),
    });
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ success: false, message: "Insufficient balance" });
  }
};
