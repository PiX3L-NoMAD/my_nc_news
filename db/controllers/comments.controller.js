const { selectCommentsByArticleId, addComment, deleteComment, patchCommentVotes } = require('../models/comments.model');

exports.getCommentsByArticleId = async (req, res, next) => {
    const { article_id } = req.params;

    try {
        const comments = await selectCommentsByArticleId(article_id)

        if (comments.length === 0) {
            return res.status(200).send({msg: "No comments found for this article" })
        } 

        res.status(200).send({ comments });
    } catch (err) {

        next(err);
    }
};

exports.postCommentByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;

    addComment(article_id, username, body)
        .then((comment) => {
            res.status(201).send({ comment });
        })
        .catch((err) => {
            next(err);
        });
};

exports.deleteCommentByCommentId = (req, res, next) => {
    const { comment_id } = req.params;

    deleteComment(comment_id).then(() => {
            res.status(204).send();
    })
    .catch((err) => {
        next(err);
    })
}

exports.updateCommentVotes = (req, res, next) => {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;

    patchCommentVotes(comment_id, inc_votes)
        .then((updatedComment) => {
            return res.status(200).send({ comment: updatedComment })   
        })
        .catch((err) => {
            next(err);
        });
};
