import express from "express";
import { login } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login); // auth/login -> login implementation is in auth controller

export default router;
