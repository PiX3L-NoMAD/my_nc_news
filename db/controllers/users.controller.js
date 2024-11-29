const endpoints = require('../../endpoints.json');
const { selectAllUsers } = require('../models/users.model');

exports.getUsers = (req, res, next) => {
    selectAllUsers().then((users) => {
        res.status(200).send({ users: users});
    })
    .catch((err) => {
        next(err);
    });
};
