const mysql = require('mysql')
const config = require('./config.json')

// Connect to the database
const connection = mysql.createConnection({
    host: config.rds_host,
    user: config.rds_user,
    password: config.rds_password,
    port: config.rds_port,
    database: config.rds_db
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
