import { assignBadge, getUserBadges } from "../services/badges.service.js";

export const assignBadgeController = async (req, res) => {
    try {
        const userId   = req.userId;
        const { emblemId } = req.body;

        if (!emblemId) {
            return res.status(400).json({ success: false, message: "emblemId is required" });
        }

        const result = await assignBadge(userId, emblemId);
        return res.status(result.success ? 201 : 200).json(result);

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getMyBadgesController = async (req, res) => {
    try {
        const userId = req.userId;
        const badges = await getUserBadges(userId);
        return res.status(200).json({ success: true, data: badges });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getUserBadgesController = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ success: false, message: "Without userId" });
        }

        const badges = await getUserBadges(userId);
        return res.status(200).json({ success: true, data: badges });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};