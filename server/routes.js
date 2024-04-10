require('dotenv').config()
const mysql = require('mysql')


// Connect to the database
const connection = mysql.createConnection({
    host: process.env.RDS_HOST,
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DB
});
connection.connect((err) => err && console.log(err));

// Route 0: GET /example/:params
const example_route = async function(req, res) {
    connection.query(`
    SELECT COUNT(*) as num
    FROM Movies
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json({count: data[0].num});
    }
  });
}

// Export routes
module.exports = {
    example_route
}
