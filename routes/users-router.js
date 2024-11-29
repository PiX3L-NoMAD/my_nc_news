const usersRouter = require("express").Router();
const { getUsers } = require('../db/controllers/users.controller');

usersRouter.route("/")
    .get(getUsers);

module.exports = usersRouter;
