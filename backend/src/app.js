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


module.exports = app;