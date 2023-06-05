import Post from "../models/Post.js"; // for getting posts
import User from "../models/User.js"; // for getting users

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body; // get userId, description, and picturePath from request body
    const user = await User.findById(userId); // find user by userId
    const newPost = new Post({ // create new post
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save(); // save new post

    const post = await Post.find().sort({ createdAt: -1 }); // find all posts and sort by createdAt descending  
    res.status(201).json(post); // return all posts
  } catch (err) {
    res.status(409).json({ message: err.message }); // return error if there is one
  }
};

/* READ */
export const getFeedPosts = async (req, res) => { 
  try {
    const post = await Post.find().sort({ createdAt: -1 }); // find all posts and sort by createdAt descending
    res.status(200).json(post); // return all posts
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params; // get userId from request parameters
    const post = await Post.find({ userId }).sort({ createdAt: -1 }); // find all posts by userId and sort by createdAt descending
    res.status(200).json(post); // return all posts
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params; // get id from request parameters
    const { userId } = req.body; // get userId from request body
    const post = await Post.findById(id); // find post by id
    const isLiked = post.likes.get(userId); // check if user has liked post

    if (isLiked) { // if user has liked post
      post.likes.delete(userId); // delete like
    } else { // if user has not liked post
      post.likes.set(userId, true); // add like
    }

    const updatedPost = await Post.findByIdAndUpdate( // update post
      id, // id
      { likes: post.likes }, // likes
      { new: true } // new object 
    );

    res.status(200).json(updatedPost); // return updated post
  } catch (err) {
    res.status(404).json({ message: err.message }); // return error if there is one
  }
};
