const db = require("../connection");

exports.selectTopics = () => {
  let sqlQuery = "SELECT * FROM topics;";
  return db
    .query(sqlQuery).then(({ rows }) => {
      return rows;
    })
    .catch((err) => {
      if (err) {
        return Promise.reject({ status: 404, msg: "Data not found" });
      }
    })
};
