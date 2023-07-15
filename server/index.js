import express from "express"; // for routing
import bodyParser from "body-parser"; // for parsing request body
import mongoose from "mongoose"; // for database
import cors from "cors"; // for cross-origin resource sharing
import dotenv from "dotenv"; // for environment variables
import multer from "multer"; // for file storage
import helmet from "helmet"; // for security
import morgan from "morgan"; // for logging
import path from "path"; // for file paths
import {fileURLToPath} from "url"; // allow us to properly set paths
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import stripeRoutes from "./routes/stripe.js";

import mergeAuthRoutes from "./routes/mergeAuth.js";
import mergeUserRoutes from "./routes/mergeUsers.js";
import mergePostRoutes from "./routes/mergePosts.js";
import mergeTokensRoutes from "./routes/mergeTokens.js";
import mergeWebinarRoutes from "./routes/mergeWebinars.js";
import mergeChatRoutes from "./routes/chatRoutes.js";
import mergeMessageRoutes from "./routes/messageRoutes.js";
import mergeSponsoredContentRoutes from "./routes/sponsoredContentRoutes.js";
import mergeDraftDataRoutes from "./routes/draftDataRoutes.js";

import {register} from "./controllers/auth.js"; // for registering user
import {createPost} from "./controllers/posts.js";
import {verifyToken} from "./middleware/auth.js";

import {mergeRegister} from "./controllers/mergeAuth.js"; // for registering user
import {createMergePost} from "./controllers/mergePosts.js";
import {applyMergePost} from "./controllers/mergePosts.js";
import {createMessage} from "./controllers/messageController.js";

import User from "./models/User.js"; // for one time user creation
import { createServer } from "http";
import { Server } from "socket.io";
import Post from "./models/Post.js"; // for one time post creation
import MergeUser from "./models/MergeUser.js";
import Location from "./models/Location.js";
import Price from "./models/Price.js";
import Webinar from "./models/Webinar.js";
import Category from "./models/Category.js";
import {mergeUsers, users, posts, locations, prices, categories} from "./data/index.js"; // for one time user and post creation


/* ADD DUMMY WEBINAR DATA */
const webinars = [
    {
        title: 'Webinar 1',
        description: 'This is webinar 1',
        url: 'http://webinar1.com',
        start: new Date(2023, 7, 1, 9, 0), // this is August 1, 2023 at 9:00 AM
        end: new Date(2023, 7, 1, 11, 0), // this is August 1, 2023 at 11:00 AM
        priceId: mongoose.Types.ObjectId(),
        userId: [mongoose.Types.ObjectId()],
    },
    // more webinars here...
];


/* CONFIGURATIONS */
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});



app.use(helmet()); // allow us to set security headers
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common")); // allow us to log requests
// app.use(bodyParser.json({ limit: "30mb", extended: true })); // allow us to parse request body
// app.use(bodyParser.urlencoded({ limit: "30mb", extended: true })); // allow us to parse request body with 30mb limit
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
const upload = multer({storage}); // initialize multer with storage -> we will use this variable to upload files

/* ROUTES WITH FILES */
//upload.single("picture") -> if you set picture it will be set in http request body as picture and multer will upload it to public/assets
app.post("/auth/register", upload.single("picture"), register); // only the register route is defined here because it is the only route that needs to upload a file
app.post("/posts", verifyToken, upload.single("picture"), createPost); // also this one has a file upload
app.post("/mergeAuth/register", upload.single("picture"), mergeRegister); // only the register route is defined here because it is the only route that needs to upload a file
app.post("/mergePosts", upload.single("picture"), createMergePost); // also this one has a file upload
app.post("/mergePosts/apply/:ideaPostId/:userId", upload.single("resume"), applyMergePost); // also this one has a file upload
app.post("/mergeMessages", upload.single("file"), createMessage); // also this one has a file upload
/* STRIPE ROUTE */
app.use("/stripe", stripeRoutes);

app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/* MERGE ROUTES */
app.use("/mergeUsers", mergeUserRoutes);
app.use("/mergeAuth", mergeAuthRoutes);
app.use("/mergePosts", mergePostRoutes);
app.use("/mergeTokens", mergeTokensRoutes);
app.use("/mergeWebinars", mergeWebinarRoutes); // added this line
app.use("/mergeChat", mergeChatRoutes);
app.use("/mergeDraftData", mergeDraftDataRoutes);
app.use("/mergeMessages", mergeMessageRoutes);
app.use("/mergeSponsoredContent", mergeSponsoredContentRoutes);

io.on("connection", (socket) => {
    // console.log("A user connected");

    // Handle events from the client
    socket.on("msg", ({ message, currentChatId }) => {
        // console.log("mesage received")
        // console.log("message: ", message)
        // console.log("currentChatId: ", currentChatId)
      // Broadcast the message to other connected clients
        socket.broadcast.emit("msg", { message: message, receivedChatId: currentChatId });
    });

    // Handle disconnection
    socket.on("shutdown", () => {
        // console.log("A user disconnected");
    });
});

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;



mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        server.listen(PORT, () => console.log(`Server Port: ${PORT}`));

        /* ADD DUMMY DATA ONE TIME */
        // User.insertMany(users);
        // Post.insertMany(posts);
        // MergeUser.insertMany(mergeUsers);
        // Category.insertMany(categories);
        // Location.insertMany(locations);
        // Price.insertMany(prices);
        // Webinar.insertMany(webinars); // added this line
    })
    .catch((error) => console.log(`${error} did not connect`));



