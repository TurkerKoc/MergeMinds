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
import stripeRoutes from "./routes/stripe.js";

import mergeAuthRoutes from "./routes/mergeAuth.js";
import mergeUserRoutes from "./routes/mergeUsers.js";
import mergePostRoutes from "./routes/mergePosts.js";

import { register } from "./controllers/auth.js"; // for registering user
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";

import { mergeRegister } from "./controllers/mergeAuth.js"; // for registering user
import { createMergePost } from "./controllers/mergePosts.js";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url); // get current file path
const __dirname = path.dirname(__filename); // get directory name of current file path
dotenv.config(); // initialize dotenv
const app = express(); // initialize express
app.use(helmet()); // allow us to set security headers
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // allow us to set security headers, cross origin resource sharing
app.use(morgan("common")); // allow us to log requests
app.use(cors()); // allow us to enable cors
app.use("/assets", express.static(path.join(__dirname, "public/assets"))); // allow us to serve static files (local storage but can bu converted to S3)

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage }); 

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);
app.post("/mergeAuth/register", upload.single("picture"), mergeRegister);
app.post("/mergePosts", upload.single("picture"), createMergePost);

/* STRIPE ROUTE */
app.use("/stripe", stripeRoutes); // stripe route for payment

/* BODY PARSER */
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

/* OTHER ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/* MERGE ROUTES */
app.use("/mergeUsers", mergeUserRoutes);
app.use("/mergeAuth", mergeAuthRoutes);
app.use("/mergePosts", mergePostRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect properly`));
