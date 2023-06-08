import express from "express"; // for routing
import bodyParser from "body-parser"; // for parsing request body
import mongoose from "mongoose"; // for database
import cors from "cors"; // for cross-origin resource sharing
import dotenv from "dotenv"; // for environment variables
import multer from "multer"; // for file storage
import helmet from "helmet"; // for security
import morgan from "morgan"; // for logging
import path from "path"; // for file paths
import { fileURLToPath } from "url"; // allow us to properly set paths
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";

import mergeAuthRoutes from "./routes/mergeAuth.js";
import mergeUserRoutes from "./routes/mergeUsers.js";

import { register } from "./controllers/auth.js"; // for registering user
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";

import { mergeRegister } from "./controllers/mergeAuth.js"; // for registering user
import User from "./models/User.js"; // for one time user creation
import Post from "./models/Post.js"; // for one time post creation
import MergeUser from "./models/MergeUser.js";
import { mergeUsers, users, posts } from "./data/index.js"; // for one time user and post creation

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url); // get current file path
const __dirname = path.dirname(__filename); // get directory name of current file path
dotenv.config(); // initialize dotenv
const app = express(); // initialize express
app.use(express.json()); // allow us to parse json
app.use(helmet()); // allow us to set security headers
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // allow us to set security headers, cross origin resource sharing
app.use(morgan("common")); // allow us to log requests
app.use(bodyParser.json({ limit: "30mb", extended: true })); // allow us to parse request body
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true })); // allow us to parse request body with 30mb limit
app.use(cors()); // allow us to enable cors
app.use("/assets", express.static(path.join(__dirname, "public/assets"))); // allow us to serve static files (local storage but can bu converted to S3)

/* FILE STORAGE */
//all below file code taken from multer github repo -> when someone uploads a photo this will set the destination and filename which is public/assets
const storage = multer.diskStorage({ 
  destination: function (req, file, cb) {
    cb(null, "public/assets"); // set destination to public/assets
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // set filename to original filename
  },
});
const upload = multer({ storage }); // initialize multer with storage -> we will use this variable to upload files

/* ROUTES WITH FILES */
//upload.single("picture") -> if you set picture it will be set in http request body as picture and multer will upload it to public/assets
app.post("/auth/register", upload.single("picture"), register); // only the register route is defined here because it is the only route that needs to upload a file
app.post("/mergeAuth/register", upload.single("picture"), mergeRegister); // only the register route is defined here because it is the only route that needs to upload a file
app.post("/posts", verifyToken, upload.single("picture"), createPost); // also this one has a file upload

/* ROUTES */
app.use("/auth", authRoutes); // auth route for login and register
app.use("/users", userRoutes); // user route for getting users
app.use("/posts", postRoutes); // post route for getting posts

/* MERGE ROUTES */
app.use("/mergeUsers", mergeUserRoutes); // user route for getting users
app.use("/mergeAuth", mergeAuthRoutes); // auth route for login and register


/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001; // set port from environment variable or 6001
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true, // allow us to parse connection string
    useUnifiedTopology: true, // allow us to use new server discovery and monitoring engine
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`)); // listen to port after connection is established

    /* ADD DUMMY DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
    // MergeUser.insertMany(mergeUsers);
  })
  .catch((error) => console.log(`${error} did not connect`)); // catch error if connection is not established
