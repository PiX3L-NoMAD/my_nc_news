const db = require("../connection");
const { isValidId } = require('../../utils');

exports.selectCommentsByArticleId = (article_id) => {
    
    if (!isValidId(article_id)) {
      return Promise.reject({ status: 400, msg: "Invalid article ID" })
    }
    
    const sqlQuery = `
    SELECT 
        comments.comment_id,
        comments.votes, 
        comments.created_at, 
        comments.author, 
        comments.body, 
        comments.article_id  
    FROM comments
    LEFT JOIN articles ON comments.article_id = articles.article_id
    WHERE comments.article_id = $1
    ORDER BY comments.created_at DESC;`;
  
    return db.query(sqlQuery, [article_id])
      .then(({ rows }) => {
        return rows;
      })
  }