
import Price from "../models/Price.js"; // for getting prices
import mongoose from "mongoose";
/* CREATE */

export const getTokens = async (req, res) => { 
  try {
    const coins = await Price.find({ 
      name: { $regex: 'MergeCoins', $options: 'i' } 
    }).sort({ createdAt: -1 });

    res.status(200).json(coins);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

