const endpointsJson = require("./endpoints.json");
const { getApi } = require("./db/controllers/app.controller");
const express = require("express");
const app = express();
app.use(express.json());

app.get("/api", getApi);

module.exports = app;
