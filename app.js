const express = require('express');
const apiRouter = require("./routes/api-router");
const { badPathErrorHandler, postgresErrorHandler, customErrorHandler, serverErrorHandler } = require('./errors/errors');

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.all('*', badPathErrorHandler);

app.use(postgresErrorHandler);

app.use(customErrorHandler);

app.use(serverErrorHandler);


module.exports = app;

/* app.get('/api', getApi);

app.get('/api/topics', getTopics);

app.get('/api/users', getUsers);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById);

app.patch('/api/articles/:article_id', patchByArticleId);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.post('/api/articles/:article_id/comments', postCommentByArticleId);

app.delete('/api/comments/:comment_id', deleteCommentByCommentId); */
