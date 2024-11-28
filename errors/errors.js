exports.badPathErrorHandler = (req, res, next) => {
    res.status(404).send({ msg: "Path not found" });
};

exports.postgresErrorHandler = (err, req, res, next) => {
    if (err.code === '22P02') {
        return res.status(400).send({msg: "Bad request - invalid input"})
    } else {
        next(err);
    }
};

exports.customErrorHandler = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({msg: err.msg})
    } else {
        next(err);
    }
};

exports.serverErrorHandler = (err, req, res, next) => {
    res.status(500).send({ msg: 'Internal server error' });
}
