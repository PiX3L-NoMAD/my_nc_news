const { checkExists } = require('../../utils');
const db = require("../connection");

exports.selectAllUsers = () => {
    const sqlQuery = 'SELECT * FROM users;'

    return db.query(sqlQuery).then(({ rows }) => {
        return rows;
    })
}
