const db = require("../connection");

exports.selectAllArticles = (sort_by = "created_at", order = "desc") => {
  const validSortBy = "created_at";
  const validOrder = ["asc", "desc"];

  if (!validSortBy.includes(sort_by) || !validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid query" });
  }

  const sqlQuery = `
  SELECT 
    articles.article_id, 
    articles.title, 
    articles.author, 
    articles.topic, 
    articles.created_at, 
    articles.votes, 
    articles.article_img_url, 
  COUNT(comments.article_id)::INT AS comment_count 
  FROM articles 
  LEFT JOIN comments ON articles.article_id = comments.article_id 
  GROUP BY articles.article_id 
  ORDER BY ${sort_by} ${order};`

  return db
    .query(sqlQuery).then(({ rows }) => {
      return rows;
    })
};

exports.selectArticleById = (article_id) => {

  const sqlQuery = `SELECT * FROM articles WHERE article_id = $1;`;

  return db
    .query(sqlQuery, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found"})
      }
      return rows;
    })
};

exports.updateArticleById = (article_id, inc_votes) => {

  const sqlQuery = `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;`;

  return db
    .query(sqlQuery, [inc_votes, article_id])
    .then(({ rows }) => {
      return rows;
    })
};
