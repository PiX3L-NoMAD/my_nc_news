const request = require("supertest");
const endpointsJson = require("../endpoints.json");
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const { string } = require("pg-format");

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
        });
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an array of all user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {

        expect(users.length).toBeGreaterThan(0);

        users.forEach((user) => {
          expect(user).toHaveProperty("username", expect.any(String));
          expect(user).toHaveProperty("name", expect.any(String));
          expect(user).toHaveProperty("avatar_url", expect.any(String));
        });
      });
  });
});

describe("GET /api/articles", () => {

  describe("200: Success responses", () => {
    test("responds with an array of all article objects, including comments_count", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {

          expect(articles.length).toBeGreaterThan(0);

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
            );

            expect(article).not.toHaveProperty("body");

          });
        });
    });
    test("should be sorted by created_at in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {

          expect(articles).toBeSortedBy("created_at", { descending: true, coerce: true });

        });
    });
    test("should be sorted by article_id in descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=article_id")
        .expect(200)
        .then(({ body: { articles } }) => {

          expect(articles).toBeSortedBy("article_id", { descending: true, coerce: true });

        });
    });
    test("should be sorted by title in descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=title")
        .expect(200)
        .then(({ body: { articles } }) => {

          expect(articles).toBeSortedBy("title", { descending: true, coerce: true });

        });
    });
    test("should be sorted by votes in descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then(({ body: { articles } }) => {

          expect(articles).toBeSortedBy("votes", { descending: true, coerce: true });

        });
    });
    test("should be sorted by author in descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then(({ body: { articles } }) => {

          expect(articles).toBeSortedBy("author", { descending: true, coerce: true });

        });
    });
    test("should be sorted by topic in descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=topic")
        .expect(200)
        .then(({ body: { articles } }) => {

          expect(articles).toBeSortedBy("topic", { descending: true, coerce: true });

        });
    });
    test("should be sorted by author in ascending order", () => {
      return request(app)
        .get("/api/articles?sort_by=author&order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {

          expect(articles).toBeSortedBy("author", { ascending: true, coerce: true });

        });
    });
    test("should be sorted by author in uppercase ascending order", () => {
      return request(app)
        .get("/api/articles?sort_by=author&order=ASC")
        .expect(200)
        .then(({ body: { articles } }) => {

          expect(articles).toBeSortedBy("author", { ascending: true, coerce: true });

        });
    });
    test("should be sorted by created_at by default, if only order is provided - ascending", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {

          expect(articles).toBeSortedBy("created_at", { ascending: true, coerce: true });

        });
    });
  });

  describe("400: Bad request errors", () => {
    test("sort_by error, queried column doesn't exist", () => {
      return request(app)
        .get("/api/articles?sort_by=bananas")
        .expect(400)
        .then(({ body }) => {

          expect(body.msg).toBe("Invalid query");

        });
    });
    test("order error, value is not allowed", () => {
      return request(app)
        .get("/api/articles?sort_by=created_at&order=dasc")
        .expect(400)
        .then(({ body }) => {

          expect(body.msg).toBe("Invalid query");

        });
    });
    test("order error, value is not allowed (order only)", () => {
      return request(app)
        .get("/api/articles?order=dasc")
        .expect(400)
        .then(({ body }) => {

          expect(body.msg).toBe("Invalid query");

        });
    });
  });

});

describe("GET /api/articles/:article_id", () => {

  describe("200: Success response", () => {
    test("returns article based on article_id", () => {
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
  });

  describe("400: Bad request error", () => {

    test("invalid article id, not an integer", () => {
      return request(app)
        .get("/api/articles/a0f4")
        .expect(400)
        .then(({ body }) => {

          expect(body.msg).toBe("Bad request - invalid input");

        });
    });
  });

  describe("404: Not found error", () => {

    test("resource not found for valid id that doesn't exist", () => {
      return request(app)
        .get("/api/articles/123456789")
        .expect(404)
        .then(({ body }) => {

          expect(body.msg).toBe("Resource not found");

        });
    });
  });
});

describe("GET /api/articles/:article_id/comments", () => {

  describe("200: Success responses", () => { 
    test("returns all comments based on article_id, latest comment first (descending order)", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {

          expect(comments.length).toBeGreaterThan(0);

          comments.forEach((comment) => {
            expect(comment.article_id).toBe(1);
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                article_id: expect.any(Number),
              })
            )
          })
        });
    });
    
    test("latest comment should be first (in descending order)", () => {
      return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        
        expect(comments).toBeSorted("created_at", { descending: true, coerce: true });
        
      });
  });

    test("200: Returns no comments found when using a valid article_id that has no comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.msg).toEqual("No comments found for this article");
        });
    });
  });


  describe("400 Errors", () => {
    test("404: Invalid article id returns no resources found when using a valid article_id doesn't exist", () => {
      return request(app)
        .get("/api/articles/23454656/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual("Resource not found");
        });
    });
    test("400: Invalid article id, returns bad requeest when using an invalid article_id", () => {
      return request(app)
        .get("/api/articles/2and5/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual("Bad request - invalid input");
        })
      })
  })
});

describe("POST /api/articles/:article_id/comments", () => {
  describe("200: Successful responses", () => {
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
  })
  describe("400 Errors", () => {
    test("400: Returns 400 error if no body provided", () => {
      const input = { username: "rogersop" }
  
      return request(app)
        .post("/api/articles/1/comments")
        .send(input)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request - invalid input");
        });
    });
    test("404: Returns 404 error if no username provided", () => {
  
      const input = { body: "In my humble opinion, I prefer beans." }
  
      return request(app)
        .post("/api/articles/1/comments")
        .send(input)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Resource not found");
        });
    });
    test("400: Returns 400 error if article_id is invalid", () => {
  
      const input = { username: "rogersop", body: "In my humble opinion, I prefer beans." }
  
      return request(app)
        .post("/api/articles/a1o5/comments")
        .send(input)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request - invalid input");
        });
    });
    test("404: Returns 404 resource not found if article doesn't exist", () => {
  
      const input = { username: "rogersop", body: "In my humble opinion, I prefer beans." }
  
      return request(app)
        .post("/api/articles/999999/comments")
        .send(input)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Resource not found");
        });
     });
  });
  test("404: Returns 404 resource not found if valid username doesn't exist", () => {
  
    const input = { username: "bibbieboo", body: "In my humble opinion, I prefer beans." }

    return request(app)
      .post("/api/articles/1/comments")
      .send(input)
      .expect(404)
      .then(({ body }) => {
          expect(body.msg).toBe("Resource not found");
      });
   });
})


describe("PATCH /api/articles/:article_id", () => {
  describe("200: Success response", () => {  
    test("updates votes for given article_id and returns the updated article", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 2 })
        .expect(200)
        .then(({body: {article}}) => {
          expect(article.article_id).toBe(1);

          expect(article.votes).toBe(102);

          expect(article).toEqual(expect.objectContaining({
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
          }))
        })
    });
  });

  describe("400 Errors", () => {
    test("400: Bad request - invalid article id, not an integer", () => {
      return request(app)
        .patch("/api/articles/a0f4")
        .send({ inc_votes: 2 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request - invalid input");
        });
    });
    test("400: Bad request - invalid votes value, not an integer", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "two" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request - invalid input");
        });
    });
    test("404: Resource not found - invalid article_id in the path, not an integer", () => {
      return request(app)
        .patch("/api/articles/9999999")
        .send({ inc_votes: 2 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Resource not found");
        });
    });
  });
});

describe("DELETE /api/comments/:comment_id", () => {

  describe("204: Success response", () => {
    test("delete comment based on comment_id and returns an empty body", () => {
      return request(app)
        .delete("/api/comments/3")
        .expect(204)
        .then((response) => {
          expect(response.body).toEqual({})
          return db.query('SELECT * FROM comments WHERE comment_id = 3;')
        })
        .then(({ rows }) => {
          expect(rows.length).toBe(0);
        })
    });
  });

  describe("400 Errors:", () => {
    test("404: Comment_id is valid but doesn't exist", () => {
      return request(app)
        .delete("/api/comments/99999999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Resource not found");
        });
    });

    test("400: Invalid comment_id, not an integer", () => {
      return request(app)
      .delete("/api/comments/5and4")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request - invalid input");
      });
    });
  });
});

describe("ERRORS", () => {
  test("404: Path not found", () => {
    return request(app)
      .get("/api/userrs")
      .expect(404)
      .then(( { body } ) => {
        expect(body.msg).toBe("Path not found")
      })
  })
  test("404: Path not found", () => {
    return request(app)
      .get("/appi/users")
      .expect(404)
      .then(( { body } ) => {
        expect(body.msg).toBe("Path not found")
      })
  })

})