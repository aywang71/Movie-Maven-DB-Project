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

// Route 1: GET /movie/:movie_id
const movie = async function (req, res) {
    const mid = req.params.movie_id;
    const query = `WITH genreID AS (
        SELECT id, GROUP_CONCAT(genre SEPARATOR ', ') AS genre
    FROM Genres
    WHERE id = ${mid}
    GROUP BY id
    ),
    companyID AS (
        SELECT id, GROUP_CONCAT(company SEPARATOR ', ') AS company
    FROM ProductionCompanies
    WHERE id = ${mid}
    GROUP BY id
    ),
    languageID AS (
        SELECT id, GROUP_CONCAT(language SEPARATOR ', ') AS language
    FROM SpokenLanguages
    WHERE id = ${mid}
    GROUP BY id
    ),
    streaming2 AS (
        SELECT *
        FROM MovieStreaming NATURAL JOIN Providers
        ORDER BY display_priority ASC
    ),
    streamingID AS (
        SELECT id, GROUP_CONCAT( DISTINCT provider ORDER BY display_priority SEPARATOR ', ') AS provider, GROUP_CONCAT( DISTINCT provider_logo ORDER BY display_priority SEPARATOR ', ') AS poster_paths
    FROM streaming2
    WHERE id = ${mid}
    GROUP BY id
    )
    SELECT *
    FROM Movies
    LEFT JOIN genreID ON Movies.id = genreID.id
    LEFT JOIN companyID ON Movies.id = companyID.id
    LEFT JOIN languageID ON Movies.id = languageID.id
    LEFT JOIN streamingID ON Movies.id = streamingID.id
    WHERE Movies.id = ${mid}
    ORDER BY Movies.popularity DESC
    `;
    connection.query(query, (err, data) => {
        if (err || data.length === 0) {
            console.log(err);
            res.status(500).json({error: "Error querying the database"});
        } else {
            res.status(200).json(data);
        }
    });
}

// Export routes
module.exports = {
    example_route,
    movie
}
