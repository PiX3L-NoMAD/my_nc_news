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