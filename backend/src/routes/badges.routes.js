import express from "express";
import {
    assignBadgeController,
    getMyBadgesController,
    getUserBadgesController,
} from "../controllers/badges.controller.js";
import { isLoged } from "../middleware.js";

const badgesRoutes = express.Router();

badgesRoutes.post("/assign", isLoged, assignBadgeController);

badgesRoutes.get("/user/me", isLoged, getMyBadgesController);

badgesRoutes.get("/user/:userId", isLoged, getUserBadgesController);

export default badgesRoutes;