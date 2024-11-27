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
  test("404: For sort_by, column that doesn't exist", () => {
      return request(app)
        .get("/api/articles?sort_by=bananas")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid query");
      });
  });
  test("404: For order, value that's not allowed'", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&order=dasc")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid query");
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
  test("returns 400 for invalid article id", () => {
    return request(app)
      .get("/api/articles/a0f4")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request - invalid input");
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

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Returns all comments based on article_id, descending order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
          expect(comments.length).toBeGreaterThan(0);

          expect(comments[0].article_id).toBe(1);

          expect(comments).toBeSorted({ descending: true });

          comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                article_id: expect.any(Number),
            }))
          })
        })
      });
  test("204: returns no comments found when using a valid article_id that has no comments", () => {
    return request(app)
      .get("/api/articles/23425/comments")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
    });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Returns 201 when post has been added to the article of give article_id ", () => {
    
    const input = { username: "rogersop", body: "In my humble opinion, I prefer beans." }
    
    return request(app)
      .post("/api/articles/2/comments")
      .send(input)
      .expect(201)
      .then(({ body }) => {
          expect(body.comment[0]).toEqual({
            comment_id: expect.any(Number),
            article_id: 2,
            author: "rogersop",
            body: "In my humble opinion, I prefer beans.",
            votes: 0,
            created_at: expect.any(String),
          });
      });
    });
  test("400: Returns 400 error if no body provided", () => {
    
    const input = { username: "rogersop" }
    
    return request(app)
      .post("/api/articles/1/comments")
      .send(input)
      .expect(400)
      .then(({ body }) => {
          expect(body.msg).toBe("Bad request - must have a valid username and a body");
        });
   });
   test("400: Returns 400 error if no username provided", () => {
    
    const input = { body: "In my humble opinion, I prefer beans." }
    
    return request(app)
      .post("/api/articles/1/comments")
      .send(input)
      .expect(400)
      .then(({ body }) => {
          expect(body.msg).toBe("Bad request - must have a valid username and a body");
        });
   });
   test("400: Returns 400 error if article doesn't exist or is invalid", () => {
    
    const input = { username: "rogersop", body: "In my humble opinion, I prefer beans." }
    
    return request(app)
      .post("/api/articles/a1/comments")
      .send(input)
      .expect(400)
      .then(({ body }) => {
          expect(body.msg).toBe("Bad request - invalid input");
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