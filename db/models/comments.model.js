const db = require("../connection");
const { checkExists } = require('../../utils');

exports.selectCommentsByArticleId = async (article_id) => {

    await checkExists('articles', 'article_id', article_id);

    const sqlQuery = `
    SELECT 
        comments.comment_id,
        comments.votes, 
        comments.created_at, 
        comments.author, 
        comments.body, 
        comments.article_id  
    FROM comments
    WHERE comments.article_id = $1
    ORDER BY comments.created_at DESC;`;
  
    const result = await db.query(sqlQuery, [article_id]);
    return result.rows;
}

exports.addComment = async (article_id, username, body) => {
    
    await checkExists('articles', 'article_id', article_id);
    await checkExists('users', 'username', username);

    const sqlQuery = `
        INSERT INTO comments 
        (article_id, author, body)
        VALUES ($1, $2, $3)
        RETURNING *;`;

    return db.query(sqlQuery, [article_id, username, body]).then(({ rows }) => {
        return rows;
    })
}

exports.deleteComment = async (comment_id) => {

    await checkExists('comments', 'comment_id', comment_id);

    const sqlQuery = `
        DELETE FROM comments 
        WHERE comment_id = $1
        RETURNING *;`;

   await db.query(sqlQuery, [comment_id]).then(({ rows }) => {
        return rows;
    })
}

exports.patchCommentVotes = (comment_id, inc_votes) => {
    return checkExists('comments', 'comment_id', comment_id)
        .then(()  => {
            const sqlQuery = `
                UPDATE comments
                SET votes = votes + $1
                WHERE comment_id = $2
                RETURNING *;
            `;

            return db.query(sqlQuery, [inc_votes, comment_id])
                .then(({ rows }) => {
                    return rows[0];
                });
        });
};
