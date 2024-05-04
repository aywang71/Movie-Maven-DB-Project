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

// Route 1: GET /movie/:movie_id
const movie = async function (req, res) {
    const mid = req.params.movie_id;
    const query = `WITH genreID AS (
        SELECT id, COALESCE(GROUP_CONCAT(genre SEPARATOR ', '), '') AS genre
    FROM Genres
    WHERE id = ${mid}
    GROUP BY id
    ),
    companyID AS (
        SELECT id, COALESCE(GROUP_CONCAT(company SEPARATOR ', '), '') AS company
    FROM ProductionCompanies
    WHERE id = ${mid}
    GROUP BY id
    ),
    languageID AS (
        SELECT id, COALESCE(GROUP_CONCAT(language SEPARATOR ', '), '') AS language
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
        SELECT id, COALESCE(GROUP_CONCAT( DISTINCT provider ORDER BY display_priority SEPARATOR ', '), '') AS provider, COALESCE(GROUP_CONCAT( DISTINCT provider_logo ORDER BY display_priority SEPARATOR ', '), '') AS provider_paths
    FROM streaming2
    WHERE id = ${mid}
    GROUP BY id
    )
    SELECT *, COALESCE(genre, '') AS genre,
    COALESCE(company, '') AS company,
    COALESCE(language, '') AS language,
    COALESCE(provider, '') AS provider,
    COALESCE(release_date, '') AS release_date,
    COALESCE(provider_paths, '') AS provider_paths
    FROM Movies
    LEFT JOIN genreID ON Movies.id = genreID.id
    LEFT JOIN companyID ON Movies.id = companyID.id
    LEFT JOIN languageID ON Movies.id = languageID.id
    LEFT JOIN streamingID ON Movies.id = streamingID.id
    WHERE Movies.id = ${mid}
    ORDER BY Movies.popularity DESC
    `;
    connection.query(query, (err, data) => {
        if (err) {
            //console.log(err);
            res.status(500).json({ error: "Error querying the database" });
        } else if (data.length === 0) {
            res.status(500).json({ error: "No results returned (nonexistent mid)" });
        } else {
            data[0].id = mid;
            res.status(200).json(data[0]);
        }
    });
}

// Route 2: Filter movies
const filtered_movies = async function (req, res) {
    const page = req.query.page ?? 1;
    const offsetAmt = (page - 1) * 50;

    const minAvg = req.query.min_avg ?? 0;
    const maxAvg = req.query.max_avg ?? 10;
    const minCount = req.query.min_count ?? 0;
    const maxCount = req.query.max_count ?? 35000;
    const isAdult = req.query.is_adult ?? 0;
    const minDate = req.query.min_date ?? '1800-01-01';
    const maxDate = req.query.max_date ?? '2050-01-01';
    const searchTitle = req.query.title ?? '';
    const listGenres = req.query.genres_list;
    let genreSub = '';
    let genreCondition = '';

    if (listGenres != null) {
        const genresListArray = listGenres.split(',');

        for (i = 0; i < genresListArray.length; i++) {
            if (i == genresListArray.length - 1) {
                const str = `
                (SELECT id
                FROM Genres USE INDEX (MovieIDGenre)
                WHERE genre = '${genresListArray[i]}')
                `
                genreSub += str;
            } else {
                const str = `
                (SELECT id
                FROM Genres USE INDEX (MovieIDGenre)
                WHERE genre = '${genresListArray[i]}')
                INTERSECT
                `
                genreSub += str;
            }
        }

        genreCondition = `AND id IN (${genreSub})`;
    }

    const listProviders = req.query.providers_list;
    let providerSub = '';
    let providerCondition = '';

    if (listProviders != null) {
        const providersListArray = listProviders.split(',');
        const providersList = '(' + providersListArray.join(',') + ')';

        providerSub = `SELECT id FROM MovieStreaming WHERE platform_id IN ${providersList}`
        providerCondition = `AND id IN (${providerSub})`;
    }

    connection.query(`
    SELECT id, title, poster_path, release_date, vote_average
    FROM Movies
    WHERE title LIKE '${searchTitle}%'
      AND vote_average BETWEEN ${minAvg} AND ${maxAvg}
      AND vote_count BETWEEN ${minCount} AND ${maxCount}
      AND adult <= ${isAdult}
      AND release_date BETWEEN DATE('${minDate}') AND DATE('${maxDate}')
      ${genreCondition} ${providerCondition}
    ORDER BY vote_count DESC
    LIMIT 50
    OFFSET ${offsetAmt};
    `, (err, data) => {
        if (err || data.length == 0) {
            //console.log(err);
            res.status(500).json({});
        } else {
            res.status(200).json(data);
        }
    });
}

// Route 3: Movie recommendations
const movie_recommendations = async function (req, res) {
    const moviesListArray = req.query.movies.split(',');
    const moviesList = '(' + moviesListArray.join(',') + ')';
    const numMovies = moviesListArray.length;

    connection.query(`
    WITH Genre_Ratios AS (
        SELECT genre, COUNT(id) / ${numMovies} AS ratio
        FROM Genres USE INDEX (MovieIDGenre)
        WHERE id IN ${moviesList}
        GROUP BY genre
        ORDER BY ratio DESC
    ), Relevant_Movies AS (
        SELECT id, title, vote_count, vote_average, poster_path, popularity, release_date
        FROM Movies USE INDEX (Movie_VC_Poster)
        WHERE vote_count > 50
            AND poster_path < 'None'
    ),Matching_Movies AS (
        SELECT id, title, vote_count, vote_average, poster_path, popularity, release_date, SUM(GR.ratio) AS match_score
        FROM Genres G
            NATURAL JOIN Genre_Ratios GR
            NATURAL JOIN Relevant_Movies
        WHERE G.id NOT IN ${moviesList}
        GROUP BY G.id
    ), Matching_Movies_Filtered AS (
        SELECT *
        FROM Matching_Movies
        WHERE match_score > (SELECT AVG(match_score) FROM Matching_Movies)
    ), Final_Info AS (
        SELECT *, MM.vote_count / MV.max_vc AS vc_ratio, MM.vote_average / MA.max_va AS va_ratio
        FROM Matching_Movies_Filtered MM,
            (SELECT MAX(vote_count) AS max_vc FROM Matching_Movies_Filtered) AS MV,
            (SELECT MAX(vote_average) AS max_va FROM Matching_Movies_Filtered) AS MA

    )
    SELECT id, title, poster_path, release_date, vote_average
    FROM Final_Info
    ORDER BY SQRT(match_score) + (0.5 * vc_ratio) + (0.2 * va_ratio) DESC
    LIMIT 50;
    `, (err, data) => {
        if (err || data.length == 0) {
            console.log(err);
            res.status(500).json({});
        } else {
            res.status(200).json(data);
        }
    });
}

// Route 4: Binge Watching
const binge_watching = async function (req, res) {
    const timeAvailable = req.query.time_available ?? 120;
    const maxRuntime = req.query.max_runtime ?? 180;
    const minRuntime = req.query.min_runtime ?? 60;
    const listGenres = req.query.genres_list;
    let genreCondition = '';

    if (listGenres != null) {
        const genresListArray = listGenres.split(',');
        const genresList = '(' + genresListArray.map(genre => `'${genre}'`).join(',') + ')';
        genreCondition = `AND genre IN ${genresList}`;
    }

    const listProviders = req.query.providers_list;
    let providerCondition = '';

    if (listProviders != null) {
        const providersListArray = listProviders.split(',');
        const providersList = '(' + providersListArray.join(',') + ')';
        providerCondition = `AND platform_id IN ${providersList}`
    }

    connection.query(`
    WITH Filtered_Movies AS (
        SELECT DISTINCT id, title, poster_path, runtime, release_date, vote_average
        FROM Movies
            NATURAL JOIN Genres
            NATURAL JOIN MovieStreaming
        WHERE vote_count > 500
            AND runtime <= ${maxRuntime}
            AND runtime >= ${minRuntime}
            ${genreCondition} ${providerCondition}
        ORDER BY vote_average DESC
    ), Selected_Movies AS (
        SELECT id, title, poster_path, runtime, release_date, vote_average,
              CASE
                  WHEN @total_time + runtime <= ${timeAvailable} THEN @total_time := @total_time + runtime
                  ELSE @total_time
              END AS cumulative_time
        FROM Filtered_Movies
            CROSS JOIN (SELECT @total_time := 0) AS init
        WHERE @total_time + runtime <= ${timeAvailable}
    )
    SELECT id,
          title,
          poster_path,
          release_date,
          cumulative_time,
          AVG(vote_average) OVER (ORDER BY vote_average DESC) AS avg_vote
    FROM Selected_Movies;
    `, (err, data) => {
        if (err || data.length == 0) {
            console.log(err);
            res.status(500).json({});
        } else {
            res.status(200).json(data);
        }
    });
}

// Route 5: Streaming services recommendations
const provider_recommendations = async function (req, res) {
    const moviesListArray = (req.query.movies ?? '').split(',');
    const moviesList = '(' + moviesListArray.join(',') + ')';
    const numMovies = moviesListArray.length;
    const streamingTypesArray = (req.query.types ?? 'free,ads,flatrate').split(',')
    const streamingTypes = '(' + streamingTypesArray.map(type => `'${type}'`).join(',') + ')';

    connection.query(`
    WITH Matching_Offers AS (
        SELECT *
        FROM MovieStreaming
        WHERE id IN ${moviesList}
            AND type IN ${streamingTypes}
        ), Provider_Count AS (
            SELECT platform_id, COUNT(DISTINCT id) AS num_movies
            FROM Matching_Offers
            GROUP BY platform_id
        ), Providers_Info AS (
            SELECT platform_id, provider, provider_logo, 
                ROUND(100 * num_movies / ${numMovies}, 2) AS pct_movies, 
                display_priority
            FROM Providers
                NATURAL JOIN Provider_Count
            ORDER BY pct_movies DESC, display_priority ASC
            LIMIT 10
        ), Provider_Movie_List AS (
            SELECT platform_id, GROUP_CONCAT(CONCAT_WS(',', type, id, title, poster_path) SEPARATOR ';') AS movie_list
            FROM Matching_Offers
                NATURAL JOIN Movies
            GROUP BY platform_id
        )
        SELECT pi.platform_id, pi.provider, pi.provider_logo, pi.pct_movies, 
            pm.movie_list
        FROM Providers_Info pi
        JOIN Provider_Movie_List pm ON pi.platform_id = pm.platform_id
        ORDER BY pi.pct_movies DESC, pi.display_priority ASC;
    `, (err, data) => {
        if (err || data == undefined) {
            // console.log(err);
            res.status(500).json({ "error": "Error querying the database" });
        } else {
            res.status(200).json(data);
        }
    });
}

// Route 6: /random
const random = async function (req, res) {
    const rand = `SELECT id FROM ViewRandom
    ORDER BY RAND()
    LIMIT 1`;
    connection.query(rand, (err, data) => {

        const mid = data[0].id;
        //console.log(mid);
        const query = `WITH genreID AS (
                SELECT id, COALESCE(GROUP_CONCAT(genre SEPARATOR ', '), '') AS genre
            FROM Genres
            WHERE id = ${mid}
            GROUP BY id
            ),
            companyID AS (
                SELECT id, COALESCE(GROUP_CONCAT(company SEPARATOR ', '), '') AS company
            FROM ProductionCompanies
            WHERE id = ${mid}
            GROUP BY id
            ),
            languageID AS (
                SELECT id, COALESCE(GROUP_CONCAT(language SEPARATOR ', '), '') AS language
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
                SELECT id, COALESCE(GROUP_CONCAT( DISTINCT provider ORDER BY display_priority SEPARATOR ', '), '') AS provider, COALESCE(GROUP_CONCAT( DISTINCT provider_logo ORDER BY display_priority SEPARATOR ', '), '') AS provider_paths
            FROM streaming2
            WHERE id = ${mid}
            GROUP BY id
            )
            SELECT *, COALESCE(genre, '') AS genre,
            COALESCE(company, '') AS company,
            COALESCE(language, '') AS language,
            COALESCE(provider, '') AS provider,
            COALESCE(release_date, '') AS release_date,
            COALESCE(provider_paths, '') AS provider_paths
            FROM Movies
            LEFT JOIN genreID ON Movies.id = genreID.id
            LEFT JOIN companyID ON Movies.id = companyID.id
            LEFT JOIN languageID ON Movies.id = languageID.id
            LEFT JOIN streamingID ON Movies.id = streamingID.id
            WHERE Movies.id = ${mid}
            ORDER BY Movies.popularity DESC
            `;
        connection.query(query, (err, data2) => {
            //console.log(data2);
            if (err) {
                //console.log(err);
                res.status(500).json({ error: "Error querying the database" });
            } else {
                data2[0].id = mid;
                res.status(200).json(data2[0]);
            }
        })

    })
}

//Route 7: /userList/?movies=
const userList = async function (req, res) {
    let movies = req.query.movies ?? '';
    if (movies === '') {
        res.status(500).json({ error: "No movies parameter in API call" });
    } else {
        let query = `select COUNT(*) AS num_movies, AVG(vote_average) AS vote_average, AVG(vote_count) AS vote_count, AVG(revenue) AS avg_revenue, AVG(budget) AS avg_budget, AVG(runtime) AS avg_runtime, AVG(popularity) AS avg_popularity
        from Movies
        where id in (`;
        movies = movies.split(',');
        let i = 0;
        while (i < movies.length) {
            query += `'${movies[i]}',`;
            i++;
        }
        query = query.substring(0, query.length - 1);
        query += ')';
        connection.query(query, (err, data) => {
            if (err) {
                //console.log(err);
                res.status(500).json({ error: "Error querying the database" });
            } else if (data[0].num_movies === 0) {
                res.status(500).json({ error: "No results returned (nonexistent filter))" });
            } else {
                res.status(200).json(data);
            }
        })
    }
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
        //console.log(data[0].num_movies);
        if (err) {
            //console.log(err);
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
                    GROUP BY id
                    HAVING COUNT(id) = ${filters[i].split(',').length}
                ),`;
        } else {
            query += ` ${tables[i]} AS (
                select id
                from ${tables[i]}
                where ${cols[tables[i]]} IN ${filters[i]}
                GROUP BY id
                HAVING COUNT(id) = ${filters[i].split(',').length}
            ),`;
        }
        ctejoin += `JOIN ${tables[i]} ON ${tables[i]}.id = Movies.id `;
        //console.log(query);
        i++;
    }
    query = query + ctejoin + ')';
    query += `select COUNT(*) AS num_movies, AVG(vote_average) AS vote_average, AVG(vote_count) AS vote_count, AVG(revenue) AS avg_revenue, AVG(budget) AS avg_budget, AVG(runtime) AS avg_runtime, AVG(popularity) AS avg_popularity
    FROM movies
    WHERE vote_count > 0`;

    //console.log(query);

    connection.query(query, (err, data) => {
        //console.log(data[0].num_movies);
        if (err) {
            //console.log(err);
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
        //console.log(data[0].num_movies);
        if (err) {
            //console.log(err);
            res.status(500).json({ error: "Error querying the database" });
        } else if (data[0].num_movies === 0) {
            res.status(500).json({ error: "No results returned (nonexistent filter))" });
        } else {
            res.status(200).json(data);
        }
    })
}

// Route 11 : /quickSearch/:title
const quickSearch = async function (req, res) {
    const title = req.params.title;
    const query = `select id, title, release_date, poster_path, overview from ViewMoviesPopular where title like '%${title}%' limit 20;`
    connection.query(query, (err, data) => {
        if (err) {
            //console.log(err);
            res.status(500).json({ error: "Error querying the database" });
        } else {
            res.status(200).json(data);
        }
    })
}

// Route 12: /topMovies/genres/:genre
const topGenres = async function (req, res) {
    const genre = req.params.genre;
    const query = `select * from ViewGenreMovies where genre = '${genre}'
    order by RAND()
    limit 24;`;
    connection.query(query, (err, data) => {
        if (err) {
            //console.log(err);
            res.status(500).json({ error: "Error querying the database" });
        } else {
            res.status(200).json(data);
        }
    })
}

// Route 13: /topMovies/providers/:provider
const topProviders = async function (req, res) {
    const provider = req.params.provider;
    //console.log(provider);
    const query = `select *
    from ViewProviderMovies
    where platform_id = (select platform_id from Providers where provider = '${provider}')
    order by RAND()
    limit 24;`;
    //console.log(query);
    connection.query(query, (err, data) => {
        if (err) {
            //console.log(err);
            res.status(500).json({ error: "Error querying the database" });
        } else {
            res.status(200).json(data);
        }
    })
}

// Route 14: /topMovies
const topMovies = async function (req, res) {
    const query = `select *
    from ViewGenreMovies
    order by RAND()
    limit 24;`;
    //console.log(query);
    connection.query(query, (err, data) => {
        if (err) {
            //console.log(err);
            res.status(500).json({ error: "Error querying the database" });
        } else {
            res.status(200).json(data);
        }
    })
}

// Export routes
module.exports = {
    movie,
    groupSingle,
    random,
    platformData,
    groupMulti,
    movie_recommendations,
    provider_recommendations,
    binge_watching,
    filtered_movies,
    userList,
    quickSearch,
    topGenres,
    topProviders,
    topMovies
}
