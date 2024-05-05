const { expect } = require('@jest/globals');
const supertest = require('supertest');
const app = require('../server');
const results = require('./results.json');

test('GET /movie/12', async () => {
  await supertest(app).get('/movie/12')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.movie)
    });
}, 15000);

test('filered', async () => {
  await supertest(app).get('/binge_watching?time_available=357&max_runtime=120&min_runtime=50&genres_list=Mystery&providers_list=8')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.binge)
    });
}, 15000);

test('recs', async () => {
  await supertest(app).get('/movie_recommendations?movies=493922,530385,310131,938614')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.movierec)
    });
}, 15000);

test('binge', async () => {
  await supertest(app).get('/filtered_movies')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.filtered)
    });
}, 15000);

test('GET /platformData/Netflix', async () => {
  await supertest(app).get('/platformData/Netflix')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.netflix)
    })
}, 15000);

test('GET /quickSearch/title', async () => {
  await supertest(app).get('/quickSearch/John')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.quickSearchJohn)
    })
}, 15000);

test('GET /platformData/netflix', async () => {
  await supertest(app).get('/platformData/Netflix')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.platformDataNetflix)
    })
}, 15000);

test('GET /userList/?movies=12,123', async () => {
  await supertest(app).get('/userList/?movies=12,123')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.userList)
    })
}, 15000);


test('providerRec', async () => {
  await supertest(app).get('/provider_recommendations?movies=493922,530385,310131,938614&types=free,ads,flatrate')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.providerRec)
    })
}, 60000);

test('GET /groupSingle', async () => {
  await supertest(app).get('/groupSingle/Genres/comedy')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.groupSingle)
    })
}, 60000);

test('GET /groupSingle1', async () => {
  await supertest(app).get('/groupSingle/ProductionCompanies/JVC')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.JVC)
    })
}, 60000);

test('GET /groupSingle2', async () => {
  await supertest(app).get('/groupSingle/SpokenLanguages/English')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.englishStats)
    })
}, 60000);

test('GET /groupSingle3', async () => {
  await supertest(app).get('/groupSingle/arggg/English')
    .expect(500)
    .then((res) => {
      expect(res.body).toStrictEqual(results.tableDNE)
    })
}, 15000);

test('GET /groupMulti', async () => {
  await supertest(app).get("/groupMulti/?tables=Genres,SpokenLanguages,Providers&filters=('Comedy','Drama'),('English'),('Netflix')")
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.groupMulti)
    })
}, 60000);

test('GET /groupMulti2', async () => {
  await supertest(app).get("/groupMulti/?tables=Genres,SpokenLanguages,Providers&filters=('Poop'),('English'),('Netflix')")
    .expect(500)
    .then((res) => {
      expect(res.body).toStrictEqual(results.invalidPlatform)
    })
}, 60000);

test('GET /groupMulti3', async () => {
  await supertest(app).get("/groupMulti/?tables=Genres&filters=(''')")
    .expect(500)
    .then((res) => {
      expect(res.body).toStrictEqual(results.serverError)
    })
}, 15000);

test('GET /userList2', async () => {
  await supertest(app).get('/userList?movies=1234')
    .expect(500)
    .then((res) => {
      expect(res.body).toStrictEqual(results.userListEmpty2)
    })
}, 15000);

test('GET /userList3', async () => {
  await supertest(app).get('/userList?movies=')
    .expect(500)
    .then((res) => {
      expect(res.body).toStrictEqual(results.userListempty)
    })
}, 15000);

test('GET /groupSingleError', async () => {
  await supertest(app).get('/groupSingle/nonexistenttable/nonexistentgroup')
    .expect(500)
    .then((res) => {
      expect(res.body).toStrictEqual(results.groupSingleError)
    })
}, 15000);

test('GET /platformError', async () => {
  await supertest(app).get('/platformData/invalidplatform')
    .expect(500)
    .then((res) => {
      expect(res.body).toStrictEqual(results.invalidPlatform)
    })
}, 15000);

test('GET /groupSingleError2', async () => {
  await supertest(app).get('/groupSingle/Genres/poop')
    .expect(500)
    .then((res) => {
      expect(res.body).toStrictEqual(results.invalidPlatform)
    })
}, 15000);

test('GET /userList500', async () => {
  await supertest(app).get("/groupSingle/Genres/'")
    .expect(500)
    .then((res) => {
      expect(res.body).toStrictEqual(results.serverError)
    })
}, 15000);

test('GET /groupSingle500', async () => {
  await supertest(app).get("/userList?movies='")
    .expect(500)
    .then((res) => {
      expect(res.body).toStrictEqual(results.serverError)
    })
}, 15000);

test('GET /platformData500', async () => {
  await supertest(app).get("/platformData/'")
    .expect(500)
    .then((res) => {
      expect(res.body).toStrictEqual(results.serverError)
    })
}, 15000);

test('GET /quickSearch500', async () => {
  await supertest(app).get("/quickSearch/'")
    .expect(500)
    .then((res) => {
      expect(res.body).toStrictEqual(results.serverError)
    })
}, 15000);

test('movie 500', async () => {
  await supertest(app).get("/movie/'")
    .expect(500)
    .then((res) => {
      expect(res.body).toStrictEqual(results.serverError)
    })
}, 15000);

test('movie 1', async () => {
  await supertest(app).get("/movie/1234")
    .expect(500)
    .then((res) => {
      expect(res.body).toStrictEqual(results.movieDNE)
    })
}, 15000);

test('providerrec 1', async () => {
  await supertest(app).get("/provider_recommendations?movies='&types=free,ads,flatrate")
    .expect(500)
    .then((res) => {
      expect(res.body).toStrictEqual(results.serverError)
    })
}, 15000);


test('GET /random', async () => {
  await supertest(app).get('/random')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual({
        id: expect.any(Number),
        title: expect.any(String),
        vote_average: expect.any(Number),
        vote_count: expect.any(Number),
        status: expect.any(String),
        release_date: expect.any(String),
        revenue: expect.any(Number),
        budget: expect.any(Number),
        runtime: expect.any(Number),
        adult: expect.any(Number),
        tagline: expect.any(String),
        overview: expect.any(String),
        original_language: expect.any(String),
        popularity: expect.any(Number),
        imdb_id: expect.any(String),
        poster_path: expect.any(String),
        genre: expect.any(String),
        company: expect.any(String),
        language: expect.any(String),
        provider: expect.any(String),
        provider_paths: expect.any(String)
      });
    });
}, 15000);

test('GET /topMovies/genres/comedy', async () => {
  await supertest(app).get('/topMovies/genres/comedy')
    .expect(200)
    .then((res) => {
      res.body.forEach((val) => expect(val).toStrictEqual({
        genre: "Comedy",
        id: expect.any(Number),
        title: expect.any(String),
        poster_path: expect.any(String),
        release_date: expect.any(String),
        vote_average: expect.any(Number)
      }));
    })
}, 15000);

test('GET /topMovies/providers/netflix', async () => {
  await supertest(app).get('/topMovies/providers/netflix')
    .expect(200)
    .then((res) => {
      res.body.forEach((val) => expect(val).toStrictEqual({
        platform_id: 8,
        id: expect.any(Number),
        title: expect.any(String),
        poster_path: expect.any(String),
        release_date: expect.any(String),
        vote_average: expect.any(Number)
      }));
    })
}, 15000);

test('GET /topMovies', async () => {
  await supertest(app).get('/topMovies')
    .expect(200)
    .then((res) => {
      res.body.forEach((val) => expect(val).toStrictEqual({
        id: expect.any(Number),
        title: expect.any(String),
        poster_path: expect.any(String),
        release_date: expect.any(String),
        vote_average: expect.any(Number)
      }));
    })
}, 15000);

test('GET /topMoviesByGenre500', async () => {
  await supertest(app).get("/topMovies/genres/'")
    .expect(500)
    .then((res) => {
      expect(res.body).toStrictEqual(results.serverError)
    })
}, 15000);

test('GET /topMoviesByProvider500', async () => {
  await supertest(app).get("/topMovies/providers/'")
    .expect(500)
    .then((res) => {
      expect(res.body).toStrictEqual(results.serverError)
    })
}, 15000);
