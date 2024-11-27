const endpoints = require('../../endpoints.json');
const { selectAllArticles, selectArticleById } = require('../models/articles.model');

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
