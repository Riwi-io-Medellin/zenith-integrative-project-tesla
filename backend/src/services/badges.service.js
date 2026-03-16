import pool from "../configuration/posgresdb.js";

const BADGE_IDS = {
    COURSE_CREATED:        'edbb8c65-5162-48f1-947c-a3c9aa3eb526',
    PUBLIC_COURSE_ACCESSED:'5f701496-363a-4000-86b4-5405559c0b7b',
    MINIGAME_SCORE:        '1ea16173-30a6-4958-b53e-a32c62801834',
};

// Asigna una insignia al usuario si aún no la tiene
export const assignBadge = async (userId, emblemId) => {
    try {
        const exists = await pool.query(
            "SELECT 1 FROM user_emblem WHERE user_id = $1 AND emblem_id = $2",
            [userId, emblemId]
        );

        if (exists.rows.length > 0) {
            return { success: false, message: "Badge already exists" };
        }

        await pool.query(
            "INSERT INTO user_emblem (user_id, emblem_id, won_at) VALUES ($1, $2, NOW())",
            [userId, emblemId]
        );

        return { success: true, message: "Badge assigned successfully" };

    } catch (error) {
        console.error("Error in assignBadge:", error);
        throw new Error("Internal Server Error");
    }
};

// Obtiene todas las insignias del usuario con su información completa
export const getUserBadges = async (userId) => {
    try {
        const query = `
            SELECT
                e.id,
                e.name,
                e.photo,
                e.redeem_points        AS points,
                ce.description,
                ce.categories,
                ue.won_at
            FROM user_emblem ue
            INNER JOIN emblem e         ON ue.emblem_id = e.id
            INNER JOIN categories_emblem ce ON ce.emblem_id = e.id
            WHERE ue.user_id = $1
            ORDER BY ue.won_at DESC
        `;
        const result = await pool.query(query, [userId]);
        return result.rows;
    } catch (error) {
        console.error("Error in getUserBadges:", error);
        throw new Error("Internal Server Error");
    }
};

export const assignCourseCreatedBadge        = (userId) => assignBadge(userId, BADGE_IDS.COURSE_CREATED);
export const assignPublicCourseAccessedBadge = (userId) => assignBadge(userId, BADGE_IDS.PUBLIC_COURSE_ACCESSED);
export const assignMinigameBadge             = (userId) => assignBadge(userId, BADGE_IDS.MINIGAME_SCORE);

export { BADGE_IDS };
