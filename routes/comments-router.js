const commentsRouter = require("express").Router();
const { deleteCommentByCommentId } = require('../db/controllers/comments.controller');

commentsRouter.route("/:comment_id")
    .delete(deleteCommentByCommentId)

module.exports = commentsRouter;