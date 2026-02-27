import * as userController from "../controllers/user.controller.js";
import express from "express";
const router = express.Router();

router.get("/profile", userController.profileUser);
router.post("/profile", userController.updateProfileUser);

export default router;
