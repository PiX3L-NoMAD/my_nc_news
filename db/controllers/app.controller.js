const endpoints = require("../../endpoints.json");
const { selectTopics } = require("../models/app.model");

exports.getApi = (req, res) => {
  res.status(200).send({ endpoints });
};

exports.getTopics = (req, res, next) => {
    selectTopics()
      .then((topics) => {
        res.status(200).send({ topics: topics });
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
};