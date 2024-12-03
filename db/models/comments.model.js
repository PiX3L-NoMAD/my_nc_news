const db = require("../connection");
const { checkExists } = require('../../utils');

exports.selectCommentsByArticleId = async (article_id, limit = 10, p = 1) => {

    const limitNum = Number(limit);
    const pageNum = Number(p);

    await checkExists('articles', 'article_id', article_id);

    if (isNaN(limitNum) || limitNum < 1 || isNaN(pageNum) || pageNum < 1) {
        return Promise.reject({ status: 400, msg: "Invalid limit or page number" })
    }

    const offset = (pageNum -1) * limitNum;

    const sqlQuery = `
    SELECT 
        comments.comment_id,
        comments.votes, 
        comments.created_at, 
        comments.author, 
        comments.body, 
        comments.article_id,
        COUNT(*) OVER()::int AS total_count 
    FROM comments
    WHERE comments.article_id = $1
    ORDER BY comments.created_at DESC
    LIMIT ${limitNum} OFFSET ${pageNum};
`;
  
    const { rows } = await db.query(sqlQuery, [article_id]);
    const total_count = rows.length > 0 ? rows[0].total_count : 0;
    return { comments: rows.map(({ total_count,  ...rest }) => rest), total_count };
};

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
