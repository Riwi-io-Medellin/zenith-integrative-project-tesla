import * as userService from '../services/user.service.js';

const profileUser = async (req, res) => {
    try {
        await userService.registerUser(full_name,email, password)
                res.status(201).json({ message: "Profile User" });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener perfil" });
    }
};

const updateProfileUser = async (req, res) => {
    try {
        await userService.updateProfile(userId, full_name, email, description, language, phone, country)
        res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error updating profile" });
    }
};

export { profileUser, updateProfileUser };