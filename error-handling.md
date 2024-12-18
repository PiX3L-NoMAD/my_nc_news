# Possible Errors

This is an _**incomplete**_ guide to the possible errors that may happen in your app. We have left some of them blank to prompt you to think about the errors that could occur as a client uses each endpoint that you have created.

Think about what could go wrong for each route, and the HTTP status code should be sent to the client in each case.
For each thing that could go wrong, make a test with your expected status code and then make sure that possibility is handled.

Bear in mind, handling bad inputs from clients doesn't necessarily have to lead to a 4\*\* status code. Handling can include using default behaviours or even ignoring parts of the request.

The following is _not_ a comprehensive list! Its purpose is just to get the ball rolling down the sad path 😢

---

## Relevant HTTP Status Codes

- 200 OK
- 201 Created
- 204 No Content
- 400 Bad Request
- 404 Not Found
- 405 Method Not Allowed
- 418 I'm a teapot
- 422 Unprocessable Entity
- 500 Internal Server Error

---

## The Express Documentation

[The Express Docs](https://expressjs.com/en/guide/error-handling.html) have a great section all about handling errors in Express.

## Unavailable Routes

### GET `/not-a-route`

- Status: 404 - Path not found (e.g. `/appi` or `/api/ussers`)

---

## Available Routes

### GET `/api/articles/:article_id`

- Status 400: Bad `article_id` (e.g. `/dog`), should be an integer number
- Status 404: Well formed `article_id` that doesn't exist in the database (e.g. `/999999`)

### PATCH `/api/articles/:article_id`

- 400: Bad `article_id` (e.g. `/dog`)
- 404: Well formed `article_id` that doesn't exist in the database (e.g. `/999999`)
- 400: Invalid `inc_votes` (e.g. `{ inc_votes : "cat" }`)

### POST `/api/articles/:article_id/comments`

- 201: Successfully created a new comment with `article_id`, `username` and `body` being all valid (e.g. `/articles/1/comments` with a request body of `{ username: 'user123', body: 'Here's my comment.' }`)
- 400: Bad request for `username` or `body` in the input body, both must be present and valid.
- 400: Bad request for invalid `article_id` (e.g. `/articles/a1/comments`), must be an integer

### GET `/api/articles/:article_id/comments`

- 200: No comments found for this article (e.g. no `comments` available for an existing `article_id`)
- 400: Invalid path (e.g. `/articles/3/4`)
- 404: Typo in the path (e.g. `/articles/3/coments`)

### GET `/api/articles`

- Bad queries:
  - 400: `sort_by` a column that doesn't exist
  - 400: `order` !== "asc" / "desc"
  - `topic` that is not in the database
  - `topic` that exists but does not have any articles associated with it

### PATCH `/api/comments/:comment_id`
  -

### DELETE `/api/comments/:comment_id`
 - 204: No Content - successful comment deletion (returns an empty response)
 - 400: Bad request - invalid input (e.g. `/api/comments/5and4`)
 - 404: Not found - valid id but does not exist (e.g. `/api/comments/9999999`)
 
