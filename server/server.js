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

app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
