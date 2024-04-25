const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
    origin: '*',
}));

// List API endpoints implemented in route.js
app.get('/example/:param_name', routes.example_route);
app.get('/movie/:movie_id', routes.movie);
app.get('/groupSingle/:table_name/:filter_group', routes.groupSingle);
app.get('/random', routes.random);
app.get('/platformData/:platform_name', routes.platformData);
app.get('/groupMulti', routes.groupMulti);
app.get('/filtered_movies', routes.filtered_movies);
app.get('/movie_recommendations', routes.movie_recommendations);
app.get('/binge_watching', routes.binge_watching);
app.get('/provider_recommendations', routes.provider_recommendations);
app.get('/userList', routes.userList);
app.get('/quickSearch', routes.quickSearch);

app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
