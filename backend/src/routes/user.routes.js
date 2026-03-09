import {profileUser,updateProfileUser} from "../controllers/user.controller.js";
import express from "express";
const userRoutes = express.Router();

userRoutes.get("/profile", profileUser);
userRoutes.put("/profileput", updateProfileUser);

export default userRoutes;
