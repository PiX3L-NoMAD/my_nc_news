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

        expect(topics.length).toBeGreaterThan(0);

        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
});

describe("POST /api/topics", () => {
  describe("Success responses", () => {
    test("201: should add a new topic and return the topic object", () => {
      const newTopic = { topic: "coding", description: "All things programming-related" };

      return request(app)
        .post("/api/topics")
        .send(newTopic)
        .expect(201)
        .then(({ body }) => {
          expect(body.topic).toEqual({
            slug: "coding",
            description: "All things programming-related",
          });
        });
    });
    test("201: should persist the topic in the database", () => {
      const newTopic = { topic: "coding", description: "All things programming-related" };
    
      return request(app)
        .post("/api/topics")
        .send(newTopic)
        .expect(201)
        .then(() => db.query("SELECT * FROM topics WHERE slug = $1", ["coding"]))
        .then(({ rows }) => {
          expect(rows).toHaveLength(1);
          expect(rows[0]).toEqual({
            slug: "coding",
            description: "All things programming-related",
          });
        });
    });
  })
  describe("Error responses", () => {
    test("400: should return error if 'slug' is missing", () => {
      const invalidTopic = { description: "Description without a slug" };
    
      return request(app)
        .post("/api/topics")
        .send(invalidTopic)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request - invalid input");
        });
    });
    test("400: should return error if request body is not an object", () => {
      return request(app)
        .post("/api/topics")
        .send("invalid format")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request - invalid input");
        });
    });
    test("409: should return error if 'slug' already exists", () => {
      const duplicateTopic = { topic: "mitch", description: "Duplicate slug test" };
    
      return request(app)
        .post("/api/topics")
        .send(duplicateTopic)
        .expect(409)
        .then(({ body }) => {
          expect(body.msg).toBe("Topic already exists");
        });
    });
    test("404: should return error for invalid endpoint", () => {
      return request(app)
        .post("/api/invalid-route")
        .send({ topic: "test", description: "Invalid endpoint test" })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Path not found");
        });
    });
  })
})

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

describe("GET /api/users/:username", () => {
  test("200: Returns a single user object based on given username", () => {
    return request(app)
      .get("/api/users/rogersop")
      .expect(200)
      .then(({ body: { user } }) => {
          expect(user).toHaveProperty("name", expect.any(String));
          expect(user).toHaveProperty("username", expect.any(String));
          expect(user).toHaveProperty("avatar_url", expect.any(String));
          
          expect(user.name).toBe("paul");
          expect(user.username).toBe("rogersop");
          expect(user.avatar_url).toBe("https://avatars2.githubusercontent.com/u/24394918?s=400&v=4");
      });
  });
  test("404: User not found, valid username but doesn't exist", () => {
    return request(app)
      .get("/api/users/notausername")
      .expect(404)
      .then(({ body }) => {
          expect(body.msg).toBe("notausername not found in the users data")});
  });
});

describe("GET /api/articles", () => {
  describe("200: Success responses", () => {
    test("All articles: responds with an array of all article objects, including comments_count", () => {
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
    test("Topic query: should filter articles by given topic", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body: { articles } }) => { 
          expect(articles.length).toBeGreaterThan(0);

          expect(articles).toBeSortedBy("created_at", { descending: true, coerce: true });

          articles.forEach((article) => {
              expect(article).toHaveProperty("article_id", expect.any(Number));
              expect(article).toHaveProperty("title", expect.any(String));
              expect(article.topic).toBe("mitch");
              expect(article).toHaveProperty("author", expect.any(String));
              expect(article).toHaveProperty("created_at", expect.any(String));
              expect(article).toHaveProperty("votes", expect.any(Number));
              expect(article).toHaveProperty("article_img_url", expect.any(String));
          });
        });
    });
    test("Sort_by query: should be sorted by created_at in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {

          expect(articles).toBeSortedBy("created_at", { descending: true, coerce: true });
          
        });
    });
    test("Order query: should be sorted by created_at by default, if only order is provided - ascending", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {

          expect(articles).toBeSortedBy("created_at", { ascending: true, coerce: true });

        });
    });
    test("Topic-Sort_By-Order combo: should be sorted by article_id in descending order", () => {
      return request(app)
        .get("/api/articles?topic=mitch&sort_by=comment_count&order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBeGreaterThan(0);

          expect(articles).toBeSortedBy("comment_count", { ascending: true, coerce: true });

          articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
            expect(article).toHaveProperty("article_id", expect.any(Number));
            expect(article).toHaveProperty("title", expect.any(String));
            expect(article).toHaveProperty("author", expect.any(String));
            expect(article).toHaveProperty("created_at", expect.any(String));
            expect(article).toHaveProperty("votes", expect.any(Number));
            expect(article).toHaveProperty("comment_count", expect.any(Number));
            expect(article).toHaveProperty("article_img_url", expect.any(String));
          });
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
      describe('Pagination query', () => {
        test('responds with correct number of articles when limit is specified', () => {
          return request(app)
            .get('/api/articles?limit=5')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).toHaveLength(5);
            });
        });
      
        test('responds with correct page of articles', () => {
          return request(app)
            .get('/api/articles?limit=3&p=1')
            .expect(200)
            .then(({ body: page1 }) => {
              return request(app)
                .get('/api/articles?limit=3&p=2')
                .expect(200)
                .then(({ body: page2 }) => {
                  expect(page1.articles[0].article_id).not.toEqual(page2.articles[0].article_id);
                });
            });
        });
      
        test('includes total_count of articles in response', () => {
          return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
              expect(body.total_count).toBeGreaterThanOrEqual(body.articles.length);
              
            });
        });
        test('defaults to limit=10 and page=1 if not provided', () => {
          return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).toHaveLength(10);
            });
        });
      });
  });
  describe("Errors:", () => {
    test("400: sort_by error, queried column doesn't exist", () => {
      return request(app)
        .get("/api/articles?sort_by=bananas")
        .expect(400)
        .then(({ body }) => {

          expect(body.msg).toBe("Invalid query");

        });
    });
    test("400: order error, value is not allowed", () => {
      return request(app)
        .get("/api/articles?sort_by=created_at&order=dasc")
        .expect(400)
        .then(({ body }) => {

          expect(body.msg).toBe("Invalid query");

        });
    });
    test("400: order error, value is not allowed (order only)", () => {
      return request(app)
        .get("/api/articles?order=dasc")
        .expect(400)
        .then(({ body }) => {

          expect(body.msg).toBe("Invalid query");

        });
    });
    test("200: should give an empty array of all articles if given topic exists but has no articles", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body }) => { 
          expect(body.msg).toBe("No articles found for this topic")
        })
    });
    test('returns 400 for invalid limit value', () => {
      return request(app)
        .get('/api/articles?limit=-1')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Invalid limit or page number');
        });
    });
  
    test('returns 400 for invalid page value', () => {
      return request(app)
        .get('/api/articles?p=0')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Invalid limit or page number');
        });
    });
  })

});

describe("POST /api/articles", () => {
  describe("Successful responses", () => {
    test("201: Returns 201 when new article has been added and responds with the new article", () => {
      
      const input = {
        author: "butter_bridge",
        title: "How to Learn to Love your Tofu",
        body: "Fun fact about Mitch, he loves tofu. Loving tofu is easier than you think. Just fry it in oil and nutritional yeast and you are good to go. It is a great source of protein, fibres and happiness. Have a try for your next dinner!",
        topic: "mitch",
        article_img_url: "http://ewebsite.org/tofu.jpg"
      }

      return request(app)
        .post("/api/articles")
        .send(input)
        .expect(201)
        .then(({ body: { article } }) => {
            expect(article).toEqual({
              article_id: expect.any(Number),
              title: "How to Learn to Love your Tofu",
              author: "butter_bridge",
              body: "Fun fact about Mitch, he loves tofu. Loving tofu is easier than you think. Just fry it in oil and nutritional yeast and you are good to go. It is a great source of protein, fibres and happiness. Have a try for your next dinner!",
              topic: "mitch",
              votes: 0,
              comment_count: 0,
              created_at: expect.any(String),
              article_img_url: "http://ewebsite.org/tofu.jpg"
            });
        });
    });
  })

  describe("Errors", () => {
    test("400: Returns error if no body provided", () => {
      const input = {
        author: "butter_bridge",
        title: "How to Learn to Love your Tofu",
        topic: "mitch",
        article_img_url: "http://ewebsite.org/tofu.jpg"
      }

      return request(app)
        .post("/api/articles")
        .send(input)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request - invalid input");
      });
    });
    test("404: Returns error if author doesn't exist", () => {

      const input = {
        author: "tofu_lover",
        title: "How to Learn to Love your Tofu",
        body: "Fun fact about Mitch, he loves tofu. Loving tofu is easier than you think. Just fry it in oil and nutritional yeast and you are good to go. It is a great source of protein, fibres and happiness. Have a try for your next dinner!",
        topic: "mitch",
        article_img_url: "http://ewebsite.org/tofu.jpg"
      }

      return request(app)
        .post("/api/articles")
        .send(input)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("tofu_lover not found in the users data");
        });
    });
    test("404: Returns error if topic doesn't exist", () => {

      const input = {
        author: "butter_bridge",
        title: "How to Learn to Love your Tofu",
        body: "Fun fact about Mitch, he loves tofu. Loving tofu is easier than you think. Just fry it in oil and nutritional yeast and you are good to go. It is a great source of protein, fibres and happiness. Have a try for your next dinner!",
        topic: "food",
        article_img_url: "http://ewebsite.org/tofu.jpg"
      }

      return request(app)
        .post("/api/articles")
        .send(input)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("food not found in the topics data");
        });
    });
    test("400: Returns 400 error if title is invalid or missing", () => {

      const input = {
        author: "butter_bridge",
        body: "Fun fact about Mitch, he loves tofu. Loving tofu is easier than you think. Just fry it in oil and nutritional yeast and you are good to go. It is a great source of protein, fibres and happiness. Have a try for your next dinner!",
        topic: "mitch",
        article_img_url: "http://ewebsite.org/tofu.jpg"
      }
      return request(app)
        .post("/api/articles")
        .send(input)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request - invalid input");
        });
    });
  })
});

describe("GET /api/articles/:article_id", () => {

  describe("200: Success response", () => {
    test("returns article based on article_id", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toHaveProperty("article_id", 2);
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("body", expect.any(String));
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("comment_count", expect.any(Number));
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

    test("article_id not found in the articles data for valid id that doesn't exist", () => {
      return request(app)
        .get("/api/articles/123456789")
        .expect(404)
        .then(({ body }) => {

          expect(body.msg).toBe("123456789 not found in the articles data");

        });
    });
  });
});

describe("DELETE /api/articles/:article_id", () => {

  describe("204: Success response", () => {
    test("delete article based on article_id, and its comments, then returns an empty body", () => {
      return request(app)
        .delete("/api/articles/3")
        .expect(204)
        .then((response) => {
          expect(response.body).toEqual({})
          return db.query('SELECT * FROM articles WHERE article_id = 3;')
        })
        .then(({ rows }) => {
          expect(rows.length).toBe(0);
          return db.query('SELECT * FROM comments WHERE article_id = 3;')
        })
        .then(({ rows }) => {
          expect(rows.length).toBe(0);
        })
    });
  });

  describe("Errors:", () => {
    test("404: article_id is valid but doesn't exist", () => {
      return request(app)
        .delete("/api/articles/99999999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("99999999 not found in the articles data");
        });
    });

    test("400: Invalid article_id, not an integer", () => {
      return request(app)
      .delete("/api/articles/5and4")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request - invalid input");
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
  ``});

    test("200: Returns no comments found when using a valid article_id that has no comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.msg).toEqual("No comments found for this article");
        });
    });

    describe('Pagination query', () => {
      test('responds with correct number of comments when limit is specified', () => {
        return request(app)
          .get('/api/articles/1/comments?limit=5')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).toHaveLength(5);
          });
      });
    
      test('responds with correct page numbers of comments', () => {
        return request(app)
          .get('/api/articles/1/comments?limit=3&p=1')
          .expect(200)
          .then(({ body: page1 }) => {
            return request(app)
              .get('/api/articles/1/comments?limit=3&p=2')
              .expect(200)
              .then(({ body: page2 }) => {
                expect(page1.comments[0].comment_id).not.toEqual(page2.comments[0].comment_id);
              });
          });
      });
    
      test('includes total_count of comments in response', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then(({ body }) => {
            expect(body.total_count).toBeGreaterThanOrEqual(body.comments.length);
          });
      });
      test('defaults to limit=10 and page=1 if not provided', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).toHaveLength(10);
          });
      });
    });
  });

  describe("Errors", () => {
    test("404: Invalid article id returns no resources found when using a valid article_id doesn't exist", () => {
      return request(app)
        .get("/api/articles/23454656/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual("23454656 not found in the articles data");
        });
    });
    test("400: Invalid article id, returns bad request when using an invalid article_id", () => {
      return request(app)
        .get("/api/articles/2and5/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual("Bad request - invalid input");
        })
    })
    test('400: Invalid limit value', () => {
      return request(app)
        .get('/api/articles/1/comments?limit=-1')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Invalid limit or page number');
        });
    });
  
    test('returns 400 for invalid page value', () => {
      return request(app)
        .get('/api/articles/1/comments?p=0')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Invalid limit or page number');
        });
    });
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
            expect(body.msg).toBe("undefined not found in the users data");
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
    test("404: Returns 404 1 not found in the articles data if article doesn't exist", () => {

      const input = { username: "rogersop", body: "In my humble opinion, I prefer beans." }

      return request(app)
        .post("/api/articles/999999/comments")
        .send(input)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("999999 not found in the articles data");
        });
    });
    test("404: Returns 404 1 not found in the articles data if valid username doesn't exist", () => {
    
      const input = { username: "bibbieboo", body: "In my humble opinion, I prefer beans." }

      return request(app)
        .post("/api/articles/1/comments")
        .send(input)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("bibbieboo not found in the users data");
        });
    });
  })
});

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
    test("404: 9999999 not found in the articles data - invalid article_id in the path, not an integer", () => {
      return request(app)
        .patch("/api/articles/9999999")
        .send({ inc_votes: 2 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("9999999 not found in the articles data");
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
          expect(body.msg).toBe("99999999 not found in the comments data");
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

describe("PATCH /api/comments/:comment_id", () => {

  describe("Success response", () => {
    test("200: Updates votes on a comment based on comment_id and returns the updated comment", () => {
      return request(app)
        .patch("/api/comments/3")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(( { body: {comment} } ) => {
          expect(comment.votes).toBe(101);
          expect(comment.comment_id).toBe(3);
          expect(comment.article_id).toBe(1);
          expect(comment.author).toBe("icellusedkars");

          expect(comment).toHaveProperty("body", expect.any(String));
          expect(comment).toHaveProperty("created_at", expect.any(String));
        });
      })  
  })

  describe("Errors:", () => {
    test("400: Bad request - inc_votes is invalid, not a number", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: 'one' })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request - invalid input");
        });
    });
    test("404: comment_id is valid but doesn't exist", () => {
      return request(app)
        .patch("/api/comments/9999999")
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("9999999 not found in the comments data");
        });
    });
    test("400: inc_votes is missing", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({})
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
      .get("/not-a-path")
      .expect(404)
      .then(( { body } ) => {
        expect(body.msg).toBe("Path not found")
      })
  })
});