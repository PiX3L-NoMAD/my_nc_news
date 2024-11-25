const request = require("supertest");
const endpointsJson = require("../endpoints.json");
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

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
        const topicsEndpoint = endpointsJson["GET /api/topics"].exampleResponse.topics;

        expect(Array.isArray(topics)).toBe(true);

        expect(topics.length).toBeGreaterThan(0);

        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        })

        expect(Object.keys(topics[0])).toStrictEqual(Object.keys(topicsEndpoint[0]));
      });
  });
  test("404: Responds with bad request for typo path", () => {
    return request(app)
      .get("/api/toppics")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Path not found');
      })
  })
});

describe("Error handlers", () => {
  test("404: Responds with an error if path doesn't exist", () => {
    return request(app)
    .get("/api/bananaz")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe('Path not found');
    });
  });
});