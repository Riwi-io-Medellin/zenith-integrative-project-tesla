import express from "express";
import {isGuest, isLoged} from "../middleware.js";
import * as authController from "../controllers/auth.controller.js";

const authRoutes = express.Router();

authRoutes.post("/login", authController.login);
authRoutes.post("/register", authController.register);

authRoutes.post("/logout", (req, res) => {

    const cookieOptions = {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    };

    res.clearCookie("user_session", cookieOptions);
    res.clearCookie("connect.sid", cookieOptions);

    if (req.session) {
        req.session.destroy((err) => {
            if (err) return res.status(500).json({ error: "No se pudo cerrar sesión" });
            res.clearCookie('connect.sid');
            return res.json({ message: "Logged out" });
        });
    } else {
        return res.json({ message: "Logged out" });
    }

    return res.json({ message: "Logged out" });
});

authRoutes.get("/confirm/:token", authController.confirmEmail);

authRoutes.get("/", isGuest, (req, res) =>{

    res.redirect(`${process.env.FRONTEND_URL}/frontend/templates/auth/index.html`)

})

authRoutes.get("/dashboard", isLoged, (req, res) => {

    res.send(`Welcome to the dashboard, user: ${req.userId}`);
    
})

export default authRoutes