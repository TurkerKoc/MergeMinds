import IdeaPost from "../models/IdeaPost.js"; // for getting posts
import MergeUser from "../models/MergeUser.js"; // for getting users
import Location from "../models/Location.js"; // for getting locations
import Category from "../models/Category.js"; // for getting categories
import Price from "../models/Price.js"; // for getting prices
import Application from "../models/Application.js"; // for getting applications
import mongoose from "mongoose";

export const getUserApplications = async ( req, res ) => {
  try {
    const { userId } = req.params;

    // Find the applications by userId
    const applications = await Application.find({ userId });

    // Extract the ideaPostIds from the applications
    const ideaPostIds = applications.map((application) => application.ideaPostId);

    // Find the IdeaPosts by ideaPostIds
    const ideaPosts = await IdeaPost.find({ _id: { $in: ideaPostIds } }).populate([
    {
      path: 'userId',
      select: 'name surname username email picturePath trustPoints',
      model: MergeUser
    },
    {
        path: 'Applications',
        select: 'content userId',
        model: Application,
        populate: {
            path: 'userId',
            select: 'name surname picturePath',
            model: MergeUser
        }
    },
    {
        path: 'categoryId',
        select: 'domain',
        model: Category
    },
    {
        path: 'locationId',
        select: 'name',
        model: Location
    },
    {
        path: 'priceId',
        select: 'amount',
        model: Price
    }
  ]).sort({ createdAt: -1 });
    res.json(ideaPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getApplicants = async (req, res) => {
  const { postId } = req.params;
  try {
    // Find the IdeaPost by postId
    const ideaPost = await IdeaPost.findById(postId);

    if (!ideaPost) {
      return res.status(404).json({ message: "Idea post not found" });
    }

    // Get the applicant user details including their picture path
    const applicants = await Application.find({ ideaPostId: postId })
      .populate({
        path: "userId",
        model: MergeUser,
      })
      .lean();

    // Restructure the response to include all user data
    const modifiedApplicants = applicants.map((applicant) => ({
      _id: applicant._id,
      user: applicant.userId,
    }));

    res.json(modifiedApplicants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const applyMergePost = async (req, res) => {
  // Extract application details from request body
  const { coverLetter, resumePath } = req.body;
  const { userId, ideaPostId } = req.params;

  // console.log(coverLetter, resumePath, userId, ideaPostId);
  // Validate request body data
  if (!coverLetter || !resumePath || !userId || !ideaPostId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Check if the userId matches the userId of the ideaPost
    const ideaPost = await IdeaPost.findById(ideaPostId);
    if (ideaPost.userId.toString() === userId) {
      return res.status(400).json({ message: 'You cannot apply to your own idea' });
    }
    // Create a new application document
    const newApplication = new Application({
      content: coverLetter,
      resumePath,
      userId: mongoose.Types.ObjectId(userId),
      ideaPostId: mongoose.Types.ObjectId(ideaPostId)
    });

    // Save the new application document
    await newApplication.save();

    // if post has prepaid applicants, decrement the prepaid applicants
    if(ideaPost.prepaidApplicants > 0) {
      ideaPost.prepaidApplicants--;
      await ideaPost.save();
    }

    return res.status(201).json(newApplication);
  } catch (err) {
    console.log(err);
    res.status(409).json({ message: err.message }); // return error if there is one
  }
};


/* CREATE */
export const createMergePost = async (req, res) => {
  // Extract post details from request body
  const { userId, locationId, title, description, isHidden, prepaidApplicants, categoryId, priceId, picturePath } = req.body;

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
          Applications: [],
          picturePath
      });

      // Save the new post document
      await newPost.save();

      // Get all posts and sort them by createdAt in descending order
      const posts = await IdeaPost.find().populate([
        {
            path: 'userId',
            select: 'name surname username email picturePath trustPoints',
            model: MergeUser
        },
        {
            path: 'Applications',
            select: 'content userId',
            model: Application,
            populate: {
                path: 'userId',
                select: 'name surname picturePath',
                model: MergeUser
            }
        },
        {
            path: 'categoryId',
            select: 'domain',
            model: Category
        },
        {
            path: 'locationId',
            select: 'name',
            model: Location
        },
        {
            path: 'priceId',
            select: 'amount',
            model: Price
        }
    ]).sort({ createdAt: -1 });

      // Respond with all posts
      return res.status(201).json(posts);
  } catch (err) {
    console.log(err);
    res.status(409).json({ message: err.message }); // return error if there is one
  }
};

/* READ */
// export const getFeedPosts = async (req, res) => { 
//   try {
//     const post = await IdeaPost.find().sort({ createdAt: -1 }); // find all posts and sort by createdAt descending
//     res.status(200).json(post); // return all posts
//   } catch (err) {
//     res.status(404).json({ message: err.message });
//   }
// };
import SponsoredContent from '../models/SponsoredContent.js';

export const getFeedPosts = async (req, res) => {
    try {
        const ideaPosts = await IdeaPost.find()
            .populate([
                {
                    path: 'userId',
                    select: 'name surname username email picturePath trustPoints',
                    model: MergeUser,
                },
                {
                    path: 'Applications',
                    select: 'content userId',
                    model: Application,
                    populate: {
                        path: 'userId',
                        select: 'name surname picturePath',
                        model: MergeUser,
                    },
                },
                {
                    path: 'categoryId',
                    select: 'domain',
                    model: Category,
                },
                {
                    path: 'locationId',
                    select: 'name',
                    model: Location,
                },
                {
                    path: 'priceId',
                    select: 'amount',
                    model: Price,
                },
            ])
            .sort({ createdAt: -1 });
        // console.log(ideaPosts);

        const sponsoredContent = await SponsoredContent.find()
            .populate([
                {
                    path: 'userId',
                    select: 'name surname username email picturePath trustPoints',
                    model: MergeUser,
                },
                {
                    path: 'Applications',
                    select: 'content userId',
                    model: Application,
                    populate: {
                        path: 'userId',
                        select: 'name surname picturePath',
                        model: MergeUser,
                    },
                },
                {
                    path: 'categoryId',
                    select: 'domain',
                    model: Category,
                },
                {
                    path: 'locationId',
                    select: 'name',
                    model: Location,
                },
                {
                    path: 'priceId',
                    select: 'amount',
                    model: Price,
                },
            ])
            .sort({ createdAt: -1 });
        // console.log(sponsoredContent);

        // Randomize the order of sponsored content
        const randomizedSponsoredContent = sponsoredContent.sort(() => Math.random() - 0.5);

        const feedPosts = [];

        let sponsoredIndex = 0;
        let postCount = 0;

        // Iterate through each IdeaPost and add sponsored content among every 5 posts
        for (const ideaPost of ideaPosts) {
            if (postCount % 5 === 0 && sponsoredIndex < randomizedSponsoredContent.length && postCount !== 0) {
                feedPosts.push(randomizedSponsoredContent[sponsoredIndex]);
                sponsoredIndex++;
            }
            feedPosts.push(ideaPost);
            postCount++;
        }

        res.status(200).json(feedPosts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get feed posts' });
    }
};


export const getUserPosts = async (req, res) => {
  try {
    // console.log(req.params)
    const { userId } = req.params; // get userId from request parameters
    const userPosts = await IdeaPost.find({ userId: mongoose.Types.ObjectId(userId) }).populate([
      {
          path: 'userId',
          select: 'name surname username email picturePath trustPoints',
          model: MergeUser
      },
      {
          path: 'Applications',
          select: 'content userId',
          model: Application,
          populate: {
              path: 'userId',
              select: 'name surname picturePath',
              model: MergeUser
          }
      },
      {
          path: 'categoryId',
          select: 'domain',
          model: Category
      },
      {
          path: 'locationId',
          select: 'name',
          model: Location
      },
      {
          path: 'priceId',
          select: 'amount',
          model: Price
      }
  ]).sort({ createdAt: -1 });
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
    ).populate([
      {
          path: 'userId',
          select: 'name surname username email picturePath trustPoints',
          model: MergeUser
      },
      {
          path: 'Applications',
          select: 'content userId',
          model: Application,
          populate: {
              path: 'userId',
              select: 'name surname picturePath',
              model: MergeUser
          }
      },
      {
          path: 'categoryId',
          select: 'domain',
          model: Category
      },
      {
          path: 'locationId',
          select: 'name',
          model: Location
      },
      {
          path: 'priceId',
          select: 'amount',
          model: Price
      }
  ]);

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
    ).populate([
      {
          path: 'userId',
          select: 'name surname username email picturePath trustPoints',
          model: MergeUser
      },
      {
          path: 'Applications',
          select: 'content userId',
          model: Application,
          populate: {
              path: 'userId',
              select: 'name surname picturePath',
              model: MergeUser
          }
      },
      {
          path: 'categoryId',
          select: 'domain',
          model: Category
      },
      {
          path: 'locationId',
          select: 'name',
          model: Location
      },
      {
          path: 'priceId',
          select: 'amount',
          model: Price
      }
  ]);

    res.status(200).json(updatedPost); // return updated post
  } catch (err) {
    res.status(404).json({ message: err.message }); // return error if there is one
  }
};

export const getPostsSortedByLikes = async (req, res) => {
  try {
    const posts = await IdeaPost.find().populate([
        {
            path: 'userId',
            select: 'name surname username email picturePath trustPoints',
            model: MergeUser
        },
        {
            path: 'Applications',
            select: 'content userId',
            model: Application,
            populate: {
                path: 'userId',
                select: 'name surname picturePath',
                model: MergeUser
            }
        },
        {
            path: 'categoryId',
            select: 'domain',
            model: Category
        },
        {
            path: 'locationId',
            select: 'name',
            model: Location
        },
        {
            path: 'priceId',
            select: 'amount',
            model: Price
        }
    ]).sort({ createdAt: -1 });
    // Sort posts based on likes
    posts.sort((a, b) => {
      const aLikes = Array.from(a.likes.values()).filter(v => v).length;
      const bLikes = Array.from(b.likes.values()).filter(v => v).length;
      return bLikes - aLikes;
    });
    res.status(200).json(posts);
  } catch (err) {
      res.status(404).json({ message: err.message });
  }
};

export const getPostsFilteredByCategory = async (req, res) => { 
  try {
    const { categoryId } = req.params;
    
    const posts = await IdeaPost.find({ categoryId }).populate([
        {
            path: 'userId',
            select: 'name surname username email picturePath trustPoints',
            model: MergeUser
        },
        {
            path: 'Applications',
            select: 'content userId',
            model: Application,
            populate: {
                path: 'userId',
                select: 'name surname picturePath',
                model: MergeUser
            }
        },
        {
            path: 'categoryId',
            select: 'domain',
            model: Category
        },
        {
            path: 'locationId',
            select: 'name',
            model: Location
        },
        {
            path: 'priceId',
            select: 'amount',
            model: Price
        }
    ]);

    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getPostsFilteredByLocation = async (req, res) => { 
  try {
    const { locationId } = req.params;
    
    const posts = await IdeaPost.find({ locationId }).populate([
        {
            path: 'userId',
            select: 'name surname username email picturePath trustPoints',
            model: MergeUser
        },
        {
            path: 'Applications',
            select: 'content userId',
            model: Application,
            populate: {
                path: 'userId',
                select: 'name surname picturePath',
                model: MergeUser
            }
        },
        {
            path: 'categoryId',
            select: 'domain',
            model: Category
        },
        {
            path: 'locationId',
            select: 'name',
            model: Location
        },
        {
            path: 'priceId',
            select: 'amount',
            model: Price
        }
    ]);

    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};



export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

export const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

export const getLocation = async (req, res) => {
  const { locationId } = req.params;

  try {
    const locaiton = await Location.findById(locationId);
    res.status(200).json(locaiton);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

export const getLocations = async (req, res) => {
  const { query } = req.query;

  try {
    const locations = await Location.find({ name: { $regex: `^${query}`, $options: 'i' } });
    res.status(200).json(locations);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
export const getCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const category = await Category.findById(categoryId);
    res.status(200).json(category);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

export const getCategories = async (req, res) => {
  const { query } = req.query;

  try {
    const categories = await Category.find({ domain: { $regex: `^${query}`, $options: 'i' } });
    res.status(200).json(categories);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
