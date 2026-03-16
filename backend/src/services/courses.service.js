import pool from "../configuration/posgresdb.js";

export const coursesServices = {

    get: async (userId) => {
        try {
            const [created, enrolled] = await Promise.all([
                pool.query("SELECT * FROM get_my_course($1)", [userId]),
                pool.query("SELECT * FROM get_user_course($1)", [userId])
            ]);
            return { created: created.rows, enrolled: enrolled.rows };
        } catch (error) {
            console.error("Error getting the user's courses", error);
            throw error;
        }
    },

    getC: async () => {
        try {
            const res = await pool.query("SELECT id, name FROM course_category ORDER BY name ASC");
            return res.rows;
        } catch (error) {
            console.error("Error getting course categories", error);
            throw error;
        }
    },

    getG: async () => {
        try {
            const res = await pool.query("SELECT id, name FROM game_catalog ORDER BY name ASC");
            return res.rows;
        } catch (error) {
            console.error("Error getting game categories", error);
            throw error;
        }
    },

    getP: async () => {
        try {
            const res = await pool.query("SELECT * FROM get_public_courses()");
            return res.rows;
        } catch (error) {
            console.error("Error getting community courses", error);
            throw error;
        }
    },

    getSessions: async (userId, limit = 5) => {
        try {
            const query = `
                SELECT
                    ugs.id,
                    ugs.earned_points  AS score,
                    ugs.played_at,
                    c.title            AS course_title,
                    c.cover_photo      AS course_photo,
                    g.name             AS game_name,
                    g.src              AS game_src
                FROM user_game_session ugs
                INNER JOIN course c      ON ugs.course_id = c.id
                INNER JOIN game_catalog g ON ugs.game_id  = g.id
                WHERE ugs.user_id = $1
                ORDER BY ugs.played_at DESC
                LIMIT $2
            `;
            const res = await pool.query(query, [userId, limit]);
            return res.rows;
        } catch (error) {
            console.error("Error getting user sessions", error);
            throw error;
        }
    },

    saveSession: async (userId, { score, gameId, courseId }) => {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            const query = "SELECT FROM save_first_session($1::uuid, $2::uuid, $3::uuid, $4) as id";
            const res = await client.query(query, [userId, gameId, courseId, score]);
            await client.query("COMMIT");
            return res.rows[0]?.id || null;
        } catch (error) {
            await client.query("ROLLBACK");
            console.error("Error in saveSession:", error.message);
            throw error;
        } finally {
            client.release();
        }
    },

    saveSessionDirect: async (userId, { score, gameId, courseId }) => {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            const query = `
                INSERT INTO user_game_session (user_id, game_id, course_id, earned_points, played_at)
                VALUES ($1::uuid, $2::uuid, $3::uuid, $4, NOW())
                RETURNING id
            `;
            const res = await client.query(query, [userId, gameId, courseId, score]);
            await client.query("COMMIT");
            return res.rows[0]?.id || null;
        } catch (error) {
            await client.query("ROLLBACK");
            console.error("Error in saveSessionDirect:", error.message);
            throw error;
        } finally {
            client.release();
        }
    },

    joinCourse: async (userId, courseId) => {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            const res = await client.query("SELECT join_course($1, $2) as progress", [userId, courseId]);
            await client.query("COMMIT");
            return res.rows[0].progress;
        } catch (error) {
            await client.query("ROLLBACK");
            console.error("Error joining course transaction");
            throw error;
        } finally {
            client.release();
        }
    },

    create: async (userId, { title, description, photo, isPublic, category, game, modules }) => {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            const queryCourse = "SELECT create_course($1, $2, $3, $4, $5::uuid, $6::uuid, $7) as id";
            const resCourse = await client.query(queryCourse, [userId, title, description, photo, game, category, isPublic]);
            const newCourseId = resCourse.rows[0].id;

            if (modules && modules.length > 0) {
                const queryModule = "INSERT INTO course_module (course_id, title, content, order_index) VALUES ($1, $2, $3, $4)";
                for (let i = 0; i < modules.length; i++) {
                    await client.query(queryModule, [newCourseId, modules[i].title, modules[i].content, i + 1]);
                }
            }

            await client.query("COMMIT");
            return { id: newCourseId };
        } catch (error) {
            await client.query("ROLLBACK");
            console.error("Error creating course transaction");
            throw error;
        } finally {
            client.release();
        }
    },

    update: async (courseId, userId, { title, description, photo, game, category, isPublic, modules }) => {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            const queryCourse = "SELECT update_course($1, $2, $3, $4, $5, $6::uuid, $7::uuid, $8) as id";
            const resCourse = await client.query(queryCourse, [courseId, userId, title, description, photo, game, category, isPublic]);
            const updateId = resCourse.rows[0].id;

            if (!updateId) throw new Error("Unauthorized: You are not the owner of this course");

            await client.query("DELETE FROM course_module WHERE course_id = $1", [courseId]);

            if (modules && modules.length > 0) {
                const queryModule = "INSERT INTO course_module (course_id, title, content, order_index) VALUES ($1, $2, $3, $4)";
                for (let i = 0; i < modules.length; i++) {
                    await client.query(queryModule, [courseId, modules[i].title, modules[i].content, i + 1]);
                }
            }

            await client.query("COMMIT");
            return { id: updateId };
        } catch (error) {
            await client.query("ROLLBACK");
            console.error("Error updating course transaction");
            throw error;
        } finally {
            client.release();
        }
    },

    delete: async (courseId, userId) => {
        try {
            const res = await pool.query(
                "DELETE FROM course WHERE id = $1 AND user_id = $2 RETURNING *",
                [courseId, userId]
            );
            if (res.rowCount === 0) return null;
            return res.rows[0];
        } catch (error) {
            console.error("Error deleting the course");
            throw error;
        }
    },
};