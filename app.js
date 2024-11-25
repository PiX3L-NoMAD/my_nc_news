const endpointsJson = require("./endpoints.json");
const { getApi, getTopics} = require("./db/controllers/app.controller");
const { badPathErrorHandler, postgresErrorHandler, customErrorHandler, serverErrorHandler } = require("./errors/errors");
const express = require("express");
const app = express();


app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.all("*", badPathErrorHandler);

app.use(postgresErrorHandler);

app.use(customErrorHandler);

module.exports = app;
