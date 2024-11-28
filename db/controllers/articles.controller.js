const endpoints = require('../../endpoints.json');
const { selectAllArticles, selectArticleById, updateArticleById } = require('../models/articles.model');

exports.getArticles = (req, res, next) => {
  const { sort_by, order } = req.query;

  selectAllArticles(sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
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

  if (typeof inc_votes !== "number") {
    return res.status(400).send({ msg: "Bad request - invalid input" });
  }

  selectArticleById(article_id).then(() => {
    updateArticleById(article_id, inc_votes).then((updatedArticle) => {
      return res.status(200).send({ article: updatedArticle });
    })
  })
  .catch((err) => {
    next(err);
  })
}
