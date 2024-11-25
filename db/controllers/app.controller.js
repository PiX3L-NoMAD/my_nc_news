const endpoints = require("../../endpoints.json");
const { selectTopics } = require("../models/app.model");

exports.getApi = (req, res) => {
  res.status(200).send({ endpoints });
};
