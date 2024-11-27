const db = require("../connection");

exports.selectCommentsByArticleId = (article_id) => {

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

exports.addComment = (article_id, username, body) => {

    const sqlQuery = `
        INSERT INTO comments 
        (article_id, author, body)
        VALUES ($1, $2, $3)
        RETURNING *;`;

    return db.query(sqlQuery, [article_id, username, body]).then(({ rows }) => {
        return rows;
    })
}