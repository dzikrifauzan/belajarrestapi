const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',  
  password: '',  
  database: 'rest_api_db',  // Nama database
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();
