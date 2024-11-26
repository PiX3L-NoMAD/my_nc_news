const db = require("../connection");

exports.selectAllArticles = () => {
  let sqlQuery = "SELECT * FROM articles;";
  return db
    .query(sqlQuery).then(({ rows }) => {
      return rows;
    })
};

exports.selectArticleById = (article_id) => {
  const validArticleId = Number(article_id);

  if (!validArticleId || article_id.length > 15) {
    return Promise.reject({ status: 400, msg: "Invalid article ID" })
  }

  let sqlQuery = `SELECT * FROM articles WHERE article_id = $1;`;

  return db
    .query(sqlQuery, [validArticleId]).then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found"})
      }
      return rows;
    })
};
