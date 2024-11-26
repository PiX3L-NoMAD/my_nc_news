const request = require("supertest");
const endpointsJson = require("../endpoints.json");
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const jestSorted = require('jest-sorted');

beforeEach(() => seed(data));

afterAll(() => db.end());

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of all topic objects", () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then(({ body: { topics } }) => {
        expect(topics.length).toBeGreaterThan(0);

        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        })
    })
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of all article objects, incl comments_count, sorted by date", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({ body: {articles} }) => {

        expect(articles.length).toBeGreaterThan(0);

        expect(articles).toBeSortedBy('created_at', {
          descending: true,
          coerce: true,
        });

        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          })
        )

        expect(article).not.toHaveProperty("body");
        })
      });
    });
});

describe("GET /api/articles/:article_id", () => {
  test("returns articles based on article_id", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body: { article } }) => {
          expect(article.length).toBeGreaterThan(0);

          expect(article[0].article_id).toBe(2);
          
          expect(article[0]).toHaveProperty("title");
          expect(article[0]).toHaveProperty("topic");
          expect(article[0]).toHaveProperty("author");
          expect(article[0]).toHaveProperty("body");
          expect(article[0]).toHaveProperty("created_at");
          expect(article[0]).toHaveProperty("votes");
          expect(article[0]).toHaveProperty("article_img_url");
        });
      });
  test("returns 400 for invalid article id - has alphabetical values", () => {
    return request(app)
      .get("/api/articles/a0f4")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid article ID");
    });
});
  test("returns 400 for invalid article id - too long", () => {
    return request(app)
      .get("/api/articles/1234567901234567")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid article ID");
    });
});
  test("returns 404 article not found for valid id that doesn't exist", () => {
    return request(app)
      .get("/api/articles/123456789")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
    });
  });
});

describe("Error handlers", () => {
  test("404: Responds with an error if path doesn't exist", () => {
    return request(app)
    .get("/api/bananasplit")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe('Not found');
    });
  });
});