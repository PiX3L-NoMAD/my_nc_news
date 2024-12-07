const db = require("../connection");

exports.selectAllTopics = () => {
  let sqlQuery = "SELECT * FROM topics;";
  return db
    .query(sqlQuery).then(({ rows }) => {
      return rows;
    })
};

exports.insertTopic = (topic, description) => {
  return db.query(`SELECT * FROM topics WHERE slug = $1;`, [topic])
  .then(({ rows }) => {

    if (rows.length > 0) {
      return Promise.reject({ status: 409, msg: "Topic already exists" })

    } else {
      const sqlQuery = `
        INSERT INTO topics (slug, description)
        VALUES ($1, $2)
        RETURNING slug, description;
      `;

      return db.query(sqlQuery, [topic, description])
        .then(({ rows }) => {
          return rows[0];
      })
    }
  })
}