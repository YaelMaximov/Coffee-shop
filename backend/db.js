const mysql2 = require('mysql2'); //interaction with a MySQL database.

const connection = mysql2.createConnection({
  connectionLimit : 70,
  host: "localhost",
  user: "root",
  password: "yael",
  database: "database_cafe",
}).promise();

module.exports = connection;