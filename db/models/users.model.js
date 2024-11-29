const db = require("../connection");
const { checkExists } = require('../../utils');
const format = require("pg-format");

exports.selectAllUsers = () => {
    const sqlQuery = 'SELECT * FROM users;'

    return db.query(sqlQuery).then(({ rows }) => {
        return rows;
    })
}

exports.selectUserByUsername = (username) => {
    return checkExists("users", "username", username)
        .then(() => {
            const sqlQuery = format(`
                SELECT  
                    users.name, 
                    users.username, 
                    users.avatar_url  
                FROM users
                WHERE users.username = $1;
            `);

            return db.query(sqlQuery, [username]);
        })
        .then(({ rows }) => {
            return rows[0];
        })
};
