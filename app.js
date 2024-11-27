const endpointsJson = require('./endpoints.json');
const { getApi } = require('./db/controllers/app.controller');
const { getArticles, getArticleById } = require('./db/controllers/articles.controller');
const { getCommentsByArticleId } = require('./db/controllers/comments.controller');
const { getTopics }= require('./db/controllers/topics.controller');
const { badPathErrorHandler, postgresErrorHandler, customErrorHandler, serverErrorHandler } = require('./errors/errors');

const express = require('express');
const app = express();

app.use(express.json());

app.get('/api', getApi);

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.all('*', badPathErrorHandler);

app.use(postgresErrorHandler);

app.use(customErrorHandler);

app.use(serverErrorHandler);

module.exports = app;
