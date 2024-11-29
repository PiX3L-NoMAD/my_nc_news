const endpoints = require("../endpoints.json");
const articlesRouter = require('./articles-router');
const commentsRouter = require('./comments-router');
const topicsRouter = require('./topics-router');
const usersRouter = require('./users-router');

const apiRouter = require('express').Router();

apiRouter.get("/", (req, res) => {
  res.status(200).send({ endpoints })
})

apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;