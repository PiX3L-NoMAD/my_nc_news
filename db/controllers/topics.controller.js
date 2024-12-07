const { selectAllTopics, insertTopic } = require("../models/topics.model");

exports.getTopics = (req, res, next) => {
    selectAllTopics()
      .then((topics) => {
        res.status(200).send({ topics: topics });
      })
      .catch((err) => {
        next(err);
      });
};

exports.postTopic = (req, res, next) => {
  const { topic, description } = req.body;
  
  insertTopic(topic, description).then((newTopic) => {
      res.status(201).send({ topic: newTopic });
    })
    .catch((err) => {
      next(err);
    });
};