//Call express from node_modules.
const express = require("express");
const path = require("path");
const bcrypt = require('bcrypt');
const db = require('./db');

//Create a instance.    
const app = express()

app.use(express.static(path.join(__dirname, '../../frontend/static')));

//Allow that express can read json 
app.use(express.json());

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "../../frontend/templates/auth/index.html")));
app.get("/register", (req, res) => res.sendFile(path.join(__dirname, "../../frontend/templates/auth/register.html")));
app.get("/dashboard", (req, res) => res.sendFile(path.join(__dirname, "../../frontend/templates/dashboard/index.html")));

app.post("/api/auth/register", async (req, res) =>{
    const { full_name, email, password } = req.body;

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = "INSERT INTO users (full_name, email, password) VALUES ($1, $2, $3) RETURNING id";
        await db.pool.query(newUser, [full_name, email, hashedPassword]);
        res.status(201).json({ message: "Usuario registrado con éxito" });
    } catch (error) {
        console.log(error);
        if(error.code === "23505"){
            return res.status(400).json({ error: "El correo ya está registrado" });
        }
        res.status(500).json({ error: "Error al registrar usuario" });
    }

})

app.post("api/auth/login", async (req, res) =>{
    const {email, password} = req.body;

    try {
        const userSelect = "SELECT * FROM users WHERE email = $1";
        const result = await db.pool.query(user, [email]);

        if(result.rows.length === 0){
            return res.status(401).json({error: "can't found the user"})
        }

        const user = result.rows[0];

        const match = await bcrypt.compare(password, user.password);

        if(match){
            res.json({ 
                message: "Bienvenido", 
                user: { id: user.id, name: user.full_name } 
            });
        }else{
            res.status(401).json({ error: "Wrong password"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error en el servidor" });
    }
})

module.exports = app;