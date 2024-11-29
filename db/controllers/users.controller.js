const { selectAllUsers, selectUserByUsername } = require('../models/users.model');

exports.getUsers = (req, res, next) => {
    selectAllUsers().then((users) => {
        res.status(200).send({ users: users});
    })
    .catch((err) => {
        next(err);
    });
};

exports.getUserByUsername = (req, res, next) => {
    const { username } = req.params;
    
    selectUserByUsername(username).then((user) => {
        res.status(200).send({ user: user });
    })
    .catch((err) => {
        next(err);
    });
};
