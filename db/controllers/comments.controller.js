const { selectCommentsByArticleId } = require('../models/comments.model');

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;

    selectCommentsByArticleId(article_id).then((comments) => {
        if (comments.length === 0) {
            res.status(204).send();
        }
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    })
  };