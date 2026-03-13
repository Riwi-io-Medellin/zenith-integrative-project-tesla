import express from "express";
import { coursesControllers } from "../controllers/courses.controllers.js";
import { isLoged } from "../middleware.js";

const courseRoutes = express.Router();

//Public routes for get data:

courseRoutes.get("/categories", coursesControllers.getCategories);

courseRoutes.get("/games", coursesControllers.getGames);

courseRoutes.get("/public", coursesControllers.getPublic);

//Private routes for specific actions:

courseRoutes.get("/", isLoged, coursesControllers.getCourses);

courseRoutes.post("/", isLoged, coursesControllers.postCourse);

courseRoutes.put("/:id", isLoged, coursesControllers.putCourse);

courseRoutes.delete("/:id", isLoged, coursesControllers.deleteCourse);



export default courseRoutes;