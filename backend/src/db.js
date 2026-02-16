require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.on("connect", (client) =>{
  const schema = process.env.DB_SCHEMA || "public";
  client.query(`SET search_path TO ${schema}, public`)
    .catch(error => console.error("Error config search_path", error));
})

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Error conectando a PostgreSQL:', err.stack);
  } else {
    console.log('✅ Conexión a PostgreSQL exitosa');
  }
});

module.exports = {pool};