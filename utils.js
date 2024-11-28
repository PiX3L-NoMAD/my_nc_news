const db = require("./db/connection");
const format = require("pg-format");

const checkExists = async (table, column, value) => {
    
    const queryStr = format("SELECT * FROM %I WHERE %I = $1;", table, column);

    const { rows } = await db.query(queryStr, [value]);
    
    if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'Resource not found' });
    }

    return rows;
};

module.exports = { checkExists };