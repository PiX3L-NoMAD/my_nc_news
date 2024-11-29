const endpoints = require('../../endpoints.json');
const { selectAllArticles, selectArticlesByTopic, selectArticleById, updateArticleById } = require('../models/articles.model');

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;

  selectAllArticles(sort_by, order, topic)
    .then((articles) => {
      if (articles.length === 0) {
        res.status(200).send({ msg: "No articles found for this topic" });
      }
      res.status(200).send({ articles: articles });
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
     })
}
