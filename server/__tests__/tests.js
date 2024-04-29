const { expect } = require('@jest/globals');
const supertest = require('supertest');
const app = require('../server');
const results = require('./results.json');

expect.extend({
    nullOrString(received) {
        return received === null || typeof received === 'String' ? {
            message: () => `expected ${received} to be String or null`,
            pass: true
        } : {
            message: () => `expected ${received} to be String or null`,
            pass: false
        };
    }
});

test('GET /example/test', async () => {
  await supertest(app).get('/example/test')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.example)
    });
}, 15000);

test('GET /movie/12', async () => {
  await supertest(app).get('/movie/12')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.movie)
    });
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
        provider: expect.nullOrString(),
        provider_paths: expect.nullOrString()
      });
    });
}, 15000);

