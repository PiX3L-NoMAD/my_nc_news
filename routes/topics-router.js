const topicsRouter = require("express").Router();
const { getTopics, postTopic }= require('../db/controllers/topics.controller');

topicsRouter.route("/")
    .get(getTopics)
    .post(postTopic)

module.exports = topicsRouter;