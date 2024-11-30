const commentsRouter = require("express").Router();
const { deleteCommentByCommentId, updateCommentVotes } = require('../db/controllers/comments.controller');

commentsRouter.route("/:comment_id")
    .patch(updateCommentVotes)
    .delete(deleteCommentByCommentId)

module.exports = commentsRouter;