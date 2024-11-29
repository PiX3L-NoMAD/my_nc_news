const topicsRouter = require("express").Router();
const { getTopics }= require('../db/controllers/topics.controller');

topicsRouter.route("/")
    .get(getTopics);

module.exports = topicsRouter;