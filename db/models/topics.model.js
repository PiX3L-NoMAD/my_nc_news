const db = require("../connection");

exports.selectAllTopics = () => {
  let sqlQuery = "SELECT * FROM topics;";
  return db
    .query(sqlQuery).then(({ rows }) => {
      return rows;
    })
};