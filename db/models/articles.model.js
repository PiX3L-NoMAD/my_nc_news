const { checkExists } = require('../../utils');
const db = require("../connection");

exports.selectAllArticles = (sort_by = "created_at", order = "DESC", topic) => {
  const validSortBy = ["article_id", "title", "author", "topic", "created_at", "votes", "comment_count"];
  const validOrder = ["ASC", "DESC"];
  const validTopics = ["cats", "mitch", "paper"];

  if (!validSortBy.includes(sort_by.toLowerCase()) || !validOrder.includes(order.toUpperCase())) {
    return Promise.reject({ status: 400, msg: "Invalid query" });
  }

  let sqlQuery = `
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
    LEFT JOIN comments ON articles.article_id = comments.article_id `;

  const queryParams = [];

  if (topic && validTopics.includes(topic.toLowerCase())) {
    sqlQuery += `WHERE articles.topic = $1 `;
    queryParams.push(topic);
  }

  sqlQuery += `
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order.toUpperCase()};`;

  return db.query(sqlQuery, queryParams).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleById = async (article_id) => {

  await checkExists('articles', 'article_id', article_id);

  const sqlQuery = `
    SELECT 
      articles.article_id, 
      articles.title, 
      articles.body, 
      articles.author, 
      articles.topic, 
      articles.created_at, 
      articles.votes, 
      articles.article_img_url, 
      COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`;

  return db
    .query(sqlQuery, [article_id])
    .then(({ rows }) => {
      return rows[0];
    })
};

exports.updateArticleById = async (article_id, inc_votes) => {

  await checkExists('articles', 'article_id', article_id);

  const sqlQuery = `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;`;

  return db
    .query(sqlQuery, [inc_votes, article_id])
    .then(({ rows }) => {
      return rows[0];
    })
};

exports.insertArticle = async (newArticle) => {
    const { author, title, body, topic, article_img_url = 'https://default-image.url', } = newArticle;

    await checkExists("users", "username", author);
    await checkExists("topics", "slug", topic);

    const sqlQuery = `
      INSERT INTO articles (author, title, body, topic, article_img_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *, (SELECT COUNT(*)::int FROM comments WHERE comments.article_id = articles.article_id) AS comment_count;
    `;
  
    const { rows } = await db.query(sqlQuery, [author, title, body, topic, article_img_url]);
    return rows[0];
  };