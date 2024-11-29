const articlesRouter = require("express").Router();
const { getArticles, getArticleById, patchByArticleId } = require('../db/controllers/articles.controller');
const { getCommentsByArticleId, postCommentByArticleId } = require('../db/controllers/comments.controller');

articlesRouter.route("/")
    .get(getArticles);

articlesRouter.route("/:article_id")
    .get(getArticleById)
    .patch(patchByArticleId)

articlesRouter.route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = articlesRouter;