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

import { verifyToken } from "./middleware/auth.js";

import { mergeRegister } from "./controllers/mergeAuth.js"; // for registering user
import { createMergePost } from "./controllers/mergePosts.js";
import { applyMergePost } from "./controllers/mergePosts.js";
import { createMessage } from "./controllers/messageController.js";

import { createServer } from "http";
import { Server } from "socket.io";

//imports for data manipulation
import MergeUser from "./models/MergeUser.js";
import Location from "./models/Location.js";
import Price from "./models/Price.js";
import Webinar from "./models/Webinar.js";
import Category from "./models/Category.js";
import { mergeUsers, locations, prices, categories } from "./data/index.js"; // for one time user and post creation
import { categories50Array } from "./data/index.js";

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
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common")); // allow us to log requests
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
app.post("/mergeAuth/register", upload.single("picture"), mergeRegister); // only the register route is defined here because it is the only route that needs to upload a file
app.post("/mergePosts", verifyToken, upload.single("picture"), createMergePost); // also this one has a file upload
app.post("/mergePosts/apply/:ideaPostId/:userId", verifyToken, upload.single("resume"), applyMergePost); // also this one has a file upload
app.post("/mergeMessages", verifyToken, upload.single("file"), createMessage); // also this one has a file upload

/* STRIPE ROUTE */
//Stripe used for payment functionality
app.use("/stripe", stripeRoutes);

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

/* ROUTES */

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

//socket for real-time chat
io.on("connection", (socket) => {
    // Handle events from the client
    socket.on("msg", ({ message, currentChatId }) => {
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
        // readCSV(); // added this line
        // try {
        //     const csvLocations = await readCSV();            
        //     Location.insertMany(csvLocations);
        //     console.log('CSV locations saved successfully');
        //   } catch (error) {
        //     console.error('Error saving CSV locations:', error);
        //   }
        // const categoriesArray = await categories50Array();
        // Category.insertMany(categoriesArray);

        // Find categories with duplicate domain names
        // const duplicateCategories = await Category.aggregate([
        //     {
        //         $group: {
        //             _id: "$domain",
        //             count: { $sum: 1 },
        //             ids: { $push: "$_id" },
        //         },
        //     },
        //     {
        //         $match: {
        //             count: { $gt: 1 },
        //         },
        //     },
        // ]);

        // if (duplicateCategories.length === 0) {
        //     console.log("No duplicate categories found.");
        //     return;
        // }

        // // Delete duplicate categories (excluding the first occurrence)
        // const deletePromises = duplicateCategories.map(async (duplicate) => {
        //     const [firstCategory, ...restCategories] = duplicate.ids;
        //     await Category.deleteMany({ _id: { $in: restCategories } });
        //     console.log(`Deleted ${restCategories.length} duplicate categories with domain: ${duplicate._id}`);
        // });

        // await Promise.all(deletePromises);

        // console.log("Duplicates deletion completed.");
        // Category.find({}, { domain: 1, _id: 1 })
        // .exec()
        // .then((documents) => {
        //     const results = documents.map((document) => ({ domain: document.domain, id: document._id }));
        //     results.forEach((result) => {
        //         console.log("Category: ", result.domain, "Id: ", result.id);
        //     });
        // })
        // .catch((error) => console.log(`Error: ${error}`));
        // console.log("MeregUsers");
        // MergeUser.find({}, { _id: 1 })
        //     .exec()
        //     .then((documents) => {
        //         const ids = documents.map((document) => document._id);
        //         console.log(ids);
        //     })
        //     .catch((error) => console.log(`Error: ${error}`));
        // console.log("Locations");
        // Location.find({ name: { $in: ["Munich, DE", "Milan, IT", "Amsterdam, NL", "Montana, BG", "Istanbul, TR", "Berlin, DE", "Prague, CZ", "Madrid, ES", "Rome, IT", "Stuttgart, DE", "Hamburg, DE", "Budapest, HU", "Frankfurt, DE", "Paris, FR", "Venice, IT", "Helsinki, FI", "Stockholm, SE"] } })
        //     .exec()
        //     .then((documents) => {
        //         const ids = documents.map((document) => document._id);
        //         console.log(ids);
        //     })
        //     .catch((error) => console.log(`Error: ${error}`));


    })
    .catch((error) => console.log(`${error} did not connect`));



