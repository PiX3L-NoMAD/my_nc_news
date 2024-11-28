const { selectCommentsByArticleId, addComment } = require('../models/comments.model');

exports.getCommentsByArticleId = async (req, res, next) => {
    const { article_id } = req.params;

    try {
        const comments = await selectCommentsByArticleId(article_id)

        if (comments.length === 0) {
            return res.status(204).send()
        } 

        res.status(200).send({ comments });
    } catch (err) {

        next(err);
    }
};

exports.postCommentByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;

    if (!username || !body) {
        return res.status(400).send({ msg: "Bad request - must have a valid username and a body" });
    }

    addComment(article_id, username, body)
        .then((comment) => {
            if (!comment) {
                return Promise.reject({ status: 400 });
            }
            res.status(201).send({ comment });
        })
        .catch((err) => {
            next(err);
        });
};
