require('dotenv').config(); // טען את משתני הסביבה מהקובץ .env

const mysql2 = require('mysql2');

const connection = mysql2.createConnection({
  connectionLimit: 70,
  host: process.env.DB_HOST,      // השתמש בערכים מתוך משתני הסביבה
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
}).promise();

module.exports = connection;