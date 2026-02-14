//Call express from node_modules.
const express = require("express");
const path = require("path");
const db = require('./db');

//Create a instance.
const app = express()

app.use(express.static(path.join(__dirname, '../../frontend/static')));

//Allow that express can read json 
app.use(express.json());

app.get("/", (req, res) =>{
    const login = path.join(__dirname, "../../frontend/templates/auth/index.html");
    res.sendFile(login);
});

app.get("/register", (req, res) => {
    const register = path.join(__dirname, "../../frontend/templates/auth/register.html");
    res.sendFile(register)
});


module.exports = app;