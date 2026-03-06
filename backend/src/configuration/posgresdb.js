import pkg from 'pg';
import "dotenv/config"

const { Pool } = pkg;

//Server connection

/* const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on("connect", (client) => {
  client.query(`SET search_path TO app_zenith, public`)
}); */

//----------------------------------------//

//Local connection with .env

const pool = new Pool({ 
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.on("connect", async (client) =>{
  const schema = process.env.DB_SCHEMA || "public";

  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(schema)) {
    console.error("The name of schema is invalid");
    return;
  }

  try {

    await client.query(`SET search_path TO "${schema}", public`)

  } catch (error) {

    console.error("Error to config search_path:", error.message)

  }
  
  
}) 

export const connectPg = async () => {

  let client;

  try {

    client = await pool.connect()

    await client.query("SELECT NOW()");
    console.log('connected to PostgreSQL');

  } catch (error) {
    
    console.error('Error connection to PostgreSQL:', error.stack);
    throw error; 
    
  }finally{

    if(client){
      client.release()
    }

  }
} 

export default pool