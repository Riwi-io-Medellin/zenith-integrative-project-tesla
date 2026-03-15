import express from "express";
import passport from "passport";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://127.0.0.1:5500";

const router = express.Router();

router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: `${FRONTEND_URL}/frontend/templates/auth/index.html` }),
  async (req, res) => {

    try {
      
      console.log("USER SESSION:", req.user);

      const { id, full_name, email, google_id } = req.user;

      res.cookie("user_session", id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
        maxAge: 1000 * 60 * 60 * 24 * 7
      });

      res.redirect(`${FRONTEND_URL}/frontend/templates/dashboard/dashboard.html`);
      
    } catch (error) {
      console.error("Error en Google Callback:", error);
      res.redirect(`${FRONTEND_URL}/frontend/templates/auth/index.html?error=google_auth_failed`);
    }

  }
);

export default router;