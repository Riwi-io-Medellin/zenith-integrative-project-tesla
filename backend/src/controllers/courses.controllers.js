import { coursesServices } from "../services/courses.service.js";
import {
    assignCourseCreatedBadge,
    assignPublicCourseAccessedBadge,
    assignMinigameBadge,
} from "../services/badges.service.js";

export const coursesControllers = {

    getCourses: async (req, res) => {
        try {
            const courses = await coursesServices.get(req.userId);
            res.status(200).json({ message: "Courses retrieved successfully", data: courses });
        } catch (error) {
            console.error("Error in getCourses:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getCategories: async (req, res) => {
        try {
            const categories = await coursesServices.getC();
            res.status(200).json({ message: "Categories retrieved successfully", data: categories });
        } catch (error) {
            console.error("Error in getCategories:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getGames: async (req, res) => {
        try {
            const games = await coursesServices.getG();
            res.status(200).json({ message: "Games retrieved successfully", data: games });
        } catch (error) {
            console.error("Error in getGames:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getPublic: async (req, res) => {
        try {
            const pCourses = await coursesServices.getP();
            res.status(200).json({ message: "Public courses retrieved successfully", data: pCourses });
        } catch (error) {
            console.error("Error in getPublic:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getSessions: async (req, res) => {
        try {
            const sessions = await coursesServices.getSessions(req.userId);
            res.status(200).json({ message: "Sessions retrieved successfully", data: sessions });
        } catch (error) {
            console.error("Error in getSessions:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    postSession: async (req, res) => {
        try {
            const userId = req.userId;
            const { score, gameId, courseId } = req.body;

            let badgeResult = { success: false };
            if (score >= 10) {
                try {
                    badgeResult = await assignMinigameBadge(userId);
                } catch (badgeError) {
                    console.log("Badge minijuego:", badgeError.message);
                }
            }

            let savedSession = null;
            try {
                savedSession = await coursesServices.saveSession(userId, { score, gameId, courseId });
            } catch (sessionError) {
                const msg = (sessionError.message || "").toLowerCase();
                const isDuplicate = msg.includes("already exists") ||
                                    msg.includes("alredy exists")  ||
                                    msg.includes("duplicate")      ||
                                    msg.includes("unique")         ||
                                    msg.includes("session");

                if (isDuplicate) {
                    try {
                        savedSession = await coursesServices.saveSessionDirect(userId, { score, gameId, courseId });
                    } catch (directError) {
                        console.error("Error en saveSessionDirect:", directError.message);
                    }
                    return res.status(200).json({
                        message: "Score processed successfully",
                        badge: badgeResult,
                        data: savedSession || null
                    });
                }
                throw sessionError;
            }

            res.status(201).json({
                message: "Session saved",
                badge: badgeResult,
                data: savedSession
            });

        } catch (error) {
            console.error("Error in postSession:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    postJoin: async (req, res) => {
        try {
            const userId = req.userId;
            const { courseId } = req.body;

            const join = await coursesServices.joinCourse(userId, courseId);

            let badgeResult = { success: false };
            try {
                badgeResult = await assignPublicCourseAccessedBadge(userId);
            } catch (badgeError) {
                console.log("Badge curso público:", badgeError.message);
            }

            res.status(201).json({ message: "Join correctly", badge: badgeResult, data: join });

        } catch (error) {
            console.error("Error in postJoin:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    postCourse: async (req, res) => {
        try {
            const userId = req.userId;
            const { title, description, photo, isPublic, category, game, modules } = req.body;

            if (!title || !description || !category || !game) {
                return res.status(400).json({ message: "Please complete all required fields" });
            }

            const createdCourse = await coursesServices.create(userId, {
                title, description, photo, isPublic, category, game, modules,
            });

            let badgeResult = { success: false };
            try {
                badgeResult = await assignCourseCreatedBadge(userId);
            } catch (badgeError) {
                console.log("Badge curso creado:", badgeError.message);
            }

            res.status(201).json({
                message: "Course created correctly",
                badge: badgeResult,
                data: createdCourse
            });

        } catch (error) {
            console.error("Error in postCourse:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    deleteCourse: async (req, res) => {
        try {
            const deletedCourse = await coursesServices.delete(req.params.id, req.userId);
            if (!deletedCourse) return res.status(404).json({ error: "Course not found" });
            res.status(200).json({ message: "Course deleted correctly", data: deletedCourse });
        } catch (error) {
            console.error("Error in deleteCourse:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    putCourse: async (req, res) => {
        try {
            const updatedData = req.body;

            if (!updatedData.title || !updatedData.description || !updatedData.category || !updatedData.game) {
                return res.status(400).json({ message: "Please complete all required fields" });
            }

            const updatedCourse = await coursesServices.update(req.params.id, req.userId, updatedData);
            res.status(200).json({ message: "Course updated correctly", data: updatedCourse });

        } catch (error) {
            if (error.message?.includes("Unauthorized")) {
                return res.status(403).json({ error: error.message });
            }
            console.error("Error in putCourse:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
};