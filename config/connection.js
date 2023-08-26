// Import the required module
const mysql = require("mysql");

// Create MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "animeIsGood123",
  database: "employee_db",
});

// Connect to the MySQL server
connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the MySQL server.");
});

// Export the connection to be used in other files
module.exports = connection;
