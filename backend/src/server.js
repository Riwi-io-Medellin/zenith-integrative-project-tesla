#!/usr/bin/env node
import app from "./app.js";
import "dotenv/config"
import dns from 'dns';
import { connectPg } from "./configuration/posgresdb.js";

dns.setDefaultResultOrder('ipv4first');

const PORT = process.env.APP_PORT || 4000;

const startServer = async () => {

    try {
        
        await connectPg();

        app.listen(PORT, () =>{
        console.log(`Join to the website: http://localhost:${PORT}`);
        });

    } catch (error) {
        
        console.error("Fail", error)

    }

}

startServer()