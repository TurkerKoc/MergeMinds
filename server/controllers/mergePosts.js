import IdeaPost from "../models/IdeaPost.js"; // for getting posts
import MergeUser from "../models/MergeUser.js"; // for getting users
import mongoose from "mongoose";
/* CREATE */
export const createMergePost = async (req, res) => {
  // Extract post details from request body
  const { userId, locationId, title, description, isHidden, prepaidApplicants, categoryId, priceId } = req.body;

  // Validate request body data
  if (!userId || !locationId || !title || !description || isHidden === undefined || prepaidApplicants === undefined || !categoryId || !priceId) {
      return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
      // Create a new post document
      const newPost = new IdeaPost({
          userId: mongoose.Types.ObjectId(userId),
          locationId: mongoose.Types.ObjectId(locationId),
          title,
          description,
          isHidden,
          prepaidApplicants,
          categoryId: mongoose.Types.ObjectId(categoryId),
          priceId: mongoose.Types.ObjectId(priceId),
          likes: new Map(),
          dislikes: new Map(),
          Applications: []
      });

      // Save the new post document
      await newPost.save();

      // Get all posts and sort them by createdAt in descending order
      const posts = await IdeaPost.find().sort('-createdAt');

      // Respond with all posts
      return res.status(201).json(posts);
  } catch (err) {
    console.log(err);
    res.status(409).json({ message: err.message }); // return error if there is one
  }
};

/* READ */
export const getFeedPosts = async (req, res) => { 
  try {
    const post = await IdeaPost.find().sort({ createdAt: -1 }); // find all posts and sort by createdAt descending
    res.status(200).json(post); // return all posts
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    console.log(req.params)
    const { userId } = req.params; // get userId from request parameters
    const userPosts = await IdeaPost.find({ userId: mongoose.Types.ObjectId(userId) }).sort('-createdAt');
    res.status(200).json(userPosts); // return all posts
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { postId } = req.params; // get id from request parameters
    const { userId } = req.body; // get userId from request body
    // Validate request body
    if (!userId || !postId) {
      return res.status(400).json({ message: 'Missing user ID or post ID' });
    }

    const post = await IdeaPost.findById(postId); // find post by id
    const isLiked = post.likes.get(userId); // check if user has liked post

    if (isLiked) { // if user has liked post
      post.likes.delete(userId); // delete like
    } else { // if user has not liked post
      post.likes.set(userId, true); // add like
    }

    const updatedPost = await IdeaPost.findByIdAndUpdate( // update post
      postId, // id
      { likes: post.likes }, // likes
      { new: true } // new object 
    );

    res.status(200).json(updatedPost); // return updated post
  } catch (err) {
    res.status(404).json({ message: err.message }); // return error if there is one
  }
};

/* UPDATE */
export const dislikePost = async (req, res) => {
  try {
    const { postId } = req.params; // get id from request parameters
    const { userId } = req.body; // get userId from request body
    // Validate request body
    if (!userId || !postId) {
      return res.status(400).json({ message: 'Missing user ID or post ID' });
    }

    const post = await IdeaPost.findById(postId); // find post by id
    const isLiked = post.dislikes.get(userId); // check if user has liked post

    if (isLiked) { // if user has liked post
      post.dislikes.delete(userId); // delete like
    } else { // if user has not liked post
      post.dislikes.set(userId, true); // add like
    }

    const updatedPost = await IdeaPost.findByIdAndUpdate( // update post
      postId, // id
      { dislikes: post.dislikes }, // dislikes
      { new: true } // new object 
    );

    res.status(200).json(updatedPost); // return updated post
  } catch (err) {
    res.status(404).json({ message: err.message }); // return error if there is one
  }
};
