const { selectAllArticles, selectArticleById, updateArticleById, insertArticle } = require('../models/articles.model');

exports.getArticles = (req, res, next) => {
  const { limit, p, sort_by, order, topic } = req.query;

  selectAllArticles(limit, p, sort_by, order, topic)
    .then(({ articles, total_count }) => {
      if (articles.length === 0) {
        res.status(200).send({ msg: "No articles found for this topic" });
      } else {
        res.status(200).send({ articles: articles, total_count: total_count });
      }
    })
    .catch((err) => {
      next(err);
    });
};
  
exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

    updateArticleById(article_id, inc_votes).then((updatedArticle) => {
      return res.status(200).send({ article: updatedArticle });
    })
    .catch((err) => {
      next(err);
     });
};

exports.postArticle = (req, res, next) => {
  const newArticle = req.body;

    insertArticle(newArticle).then((postedArticle) => {
      return res.status(201).send({ article: postedArticle })
    })
    .catch((err) => {
      next(err);
    });
};
