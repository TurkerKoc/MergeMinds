
import Webinar from "../models/Webinar.js"; // for getting prices
import MergeUser from "../models/MergeUser.js"; 
import mongoose from "mongoose";
/* CREATE */

export const getWebinars = async (req, res) => { 
  try {
    // return all webinars
    const webinars = await Webinar.find().sort({ createdAt: -1 });
    console.log(webinars)
    res.status(200).json(webinars);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }

};

export const enrollInWebinar = async (req, res) => {
  try {
    console.log("Enrolling in webinar");
    // print req
    //console.log(req.params);
    const webinar = await Webinar.findById(req.params.webinarId); // Assuming your model is named "Webinar"
    console.log("Webinar:", webinar);
    console.log("User ID:", req.params.userId);
    webinar.atendees.push(req.params.userId); // Assuming the user ID is stored in req.userId
    await webinar.save();

    res.status(200).json(webinar);
  } catch (error) {
    res.status(500).json({ message: "Could not enroll user in webinar" });
  }
};

export const updateUserCoins = async (req, res) => {
  try {
    const user = await MergeUser.findById(req.params.userId); // Assuming your model is named "User"
    user.mergeCoins = req.body.mergeCoins; // Assuming the new number of coins is sent in the body
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Could not update user coins" });
  }
};
