import pool from "../configuration/posgresdb.js";

// Obtener perfil completo del usuario (incluye u.id para el frontend)
const profile = async (userId) => {
    const query = `
        SELECT
            u.id,
            u.full_name,
            u.email,
            p.description,
            p.language,
            p.photo,
            p.phone,
            p.country
        FROM users u
        LEFT JOIN profile p ON u.id = p.id
        WHERE u.id = $1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0];
};

// Actualizar perfil del usuario
const updateProfile = async (userId, data) => {
    const { full_name, email, description, language, phone, country, photo } = data;

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        await client.query(
            "UPDATE users SET full_name = $1, email = $2 WHERE id = $3",
            [full_name, email, userId]
        );

        await client.query(
            `INSERT INTO profile (id, description, language, phone, country, photo)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (id) DO UPDATE SET
                description = EXCLUDED.description,
                language    = EXCLUDED.language,
                phone       = EXCLUDED.phone,
                country     = EXCLUDED.country,
                photo       = EXCLUDED.photo`,
            [userId, description, language, phone, country, photo]
        );

        await client.query("COMMIT");
        return { success: true };

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

export { profile, updateProfile };
