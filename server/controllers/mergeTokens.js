
import Price from "../models/Price.js"; // for getting prices
import mongoose from "mongoose";
/* CREATE */

export const getTokens = async (req, res) => { 
  try {
    const coins = await Price.find({ 
      name: { $in: ['MergeCoins2', 'MergeCoins4', 'MergeCoins6'] } 
    }).sort({ createdAt: -1 });
    console.log(coins)<
    res.status(200).json(coins);
  } catch (err) {
      res.status(404).json({ message: err.message });
  }
};

