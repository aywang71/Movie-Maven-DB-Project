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
const example_route = async function (req, res) {
    connection.query(`
    SELECT COUNT(*) as num
    FROM Movies
  `, (err, data) => {
        if (err || data.length === 0) {
            console.log(err);
            res.json({});
        } else {
            res.json({ count: data[0].num });
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
        SELECT id, GROUP_CONCAT( DISTINCT provider ORDER BY display_priority SEPARATOR ', ') AS provider, GROUP_CONCAT( DISTINCT provider_logo ORDER BY display_priority SEPARATOR ', ') AS provider_paths
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
        data[0].id = mid;
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Error querying the database" });
        } else if (data.length === 0) {
            res.status(500).json({ error: "No results returned (nonexistent mid)" });
        } else {
            res.status(200).json(data);
        }
    });
}

// Route 6: /random
const random = async function (req, res) {
    const rand = `SELECT id FROM Movies
    ORDER BY RAND()
    LIMIT 1`;
    connection.query(rand, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Error querying the database" });
        } else {
            const mid = data[0].id;
            console.log(mid);
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
                SELECT id, GROUP_CONCAT( DISTINCT provider ORDER BY display_priority SEPARATOR ', ') AS provider, GROUP_CONCAT( DISTINCT provider_logo ORDER BY display_priority SEPARATOR ', ') AS provider_paths
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
            connection.query(query, (err, data2) => {

                data2[0].id = mid;
                console.log(data2);
                if (err) {
                    console.log(err);
                    res.status(500).json({ error: "Error querying the database" });
                } else if (data2.length === 0) {
                    res.status(500).json({ error: "No results returned (nonexistent mid)" });
                } else {
                    res.status(200).json(data2);
                }
            })
        }
    })
}

// Route 8: /groupSingle/:table_name/:filter_group
const groupSingle = async function (req, res) { //maybe make a view due to runtime constraints
    const group = req.params.table_name;
    const filter = req.params.filter_group;
    let query = `select COUNT(*) AS num_movies, AVG(vote_average) AS vote_average, AVG(vote_count) AS vote_count, AVG(revenue) AS avg_revenue, AVG(budget) AS avg_budget, AVG(runtime) AS avg_runtime, AVG(popularity) AS avg_popularity `;
    if (group === "Genres") {
        query += `from Genres join Movies on Genres.id = Movies.id where genre = '${filter}' AND vote_count > 0`;
    } else if (group === "ProductionCompanies") {
        query += `from ProductionCompanies join Movies on ProductionCompanies.id = Movies.id where company = '${filter}' AND vote_count > 0`;
    } else if (group === "SpokenLanguages") {
        query += `from SpokenLanguages join Movies on SpokenLanguages.id = Movies.id where language = '${filter}' AND vote_count > 0`;
    } else {
        res.status(500).json({ error: "table_name parameter does not exist" });
        return;
    }
    //console.log(query);

    connection.query(query, (err, data) => {
        console.log(data[0].num_movies);
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Error querying the database" });
        } else if (data[0].num_movies === 0) {
            res.status(500).json({ error: "No results returned (nonexistent filter))" });
        } else {
            res.status(200).json(data);
        }
    })
}

// Route 9: groupMulti
const groupMulti = async function (req, res) {
    //Note: always searches for intersections among all groups
    //Expected format: 'table1,table2,table3...' 
    //Filters: 'filter1,filter2,filter3...'
    //Where the is all attributes corresponding to the table: i.e for genres "('Comedy','Drama'), ... (next filter)"
    let tables = req.query.tables;
    tables = tables.split(",");
    const cols = {
        Genres: "genre",
        ProductionCompanies: "company",
        SpokenLanguages: "language"
    }
    let filters = req.query.filters;
    filters = filters.split("),");
    let i = 0;
    while (i < filters.length - 1) {
        filters[i] += ")";
        i++;
    }
    let query = 'WITH';
    let ctejoin = `movies AS (
        select vote_average, vote_count, revenue, budget, runtime, popularity 
        FROM Movies `;
    i = 0;
    while (i < tables.length) {
        //console.log(i);
        if (tables[i] === 'Providers') {
            query += ` Providers2 AS (
                select platform_id as pid
                from Providers
                where provider IN ${filters[i]}),
                Providers AS (
                    select id from MovieStreaming
                    join Providers2 on Providers2.pid = MovieStreaming.platform_id
                ),`;
        } else {
            query += ` ${tables[i]} AS (
                select id
                from ${tables[i]}
                where ${cols[tables[i]]} IN ${filters[i]}),`;
        }
        ctejoin += `JOIN ${tables[i]} ON ${tables[i]}.id = Movies.id `;
        //console.log(query);
        i++;
    }
    query = query + ctejoin + ')';
    query += `select COUNT(*) AS num_movies, AVG(vote_average) AS vote_average, AVG(vote_count) AS vote_count, AVG(revenue) AS avg_revenue, AVG(budget) AS avg_budget, AVG(runtime) AS avg_runtime, AVG(popularity) AS avg_popularity
    FROM movies
    WHERE vote_count > 0`;

    connection.query(query, (err, data) => {
        console.log(data[0].num_movies);
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Error querying the database" });
        } else if (data[0].num_movies === 0) {
            res.status(500).json({ error: "No results returned (nonexistent filter))" });
        } else {
            res.status(200).json(data);
        }
    })
}

// Route 10: /platformData/:platform_name
const platformData = async function (req, res) {
    const plat = req.params.platform_name;
    const query = `WITH platform AS (
        select platform_id as pid, provider_logo as logo from Providers
                 where provider = '${plat}'
    ),
    
        ids AS (
                select * from MovieStreaming
                join platform on platform.pid = MovieStreaming.platform_id
            )
            select COUNT(*) AS num_movies, AVG(vote_average) AS vote_average, AVG(vote_count) AS vote_count, AVG(revenue) AS avg_revenue, AVG(budget) AS avg_budget, AVG(runtime) AS avg_runtime, AVG(popularity) AS avg_popularity, logo
            from Movies join ids on ids.id = Movies.id
            WHERE vote_count > 0`;

    connection.query(query, (err, data) => {
        console.log(data[0].num_movies);
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Error querying the database" });
        } else if (data[0].num_movies === 0) {
            res.status(500).json({ error: "No results returned (nonexistent filter))" });
        } else {
            res.status(200).json(data);
        }
    })
}
// Export routes
module.exports = {
    example_route,
    movie,
    groupSingle,
    random,
    platformData,
    groupMulti
}
