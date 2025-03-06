
const db = require("../utility/database");

// find family with familycode
const findFamily = async ({ familycode }) => {
  const result = await db.query('SELECT * FROM family WHERE familycode = ?', [familycode]);
  return result.length > 0; 
};

//find user with email
const isExists = ({ email }) => {
    return db
      .query(`SELECT * FROM users WHERE email = ?;`, [email])
      .then((res) => {
        return res[0][0];
      });
  }; 
 



//create New Family user
const NewsignupModel = async ({ familycode, username, email, password }) => {
  await db.query(
    `INSERT INTO users (familycode, username, email, password) VALUES (?, ?, ?, ?);`,
    [familycode, username, email, password],
    'INSERT INTO family (familycode) VALUES (?)',
    [familycode]
  );

  return await db
    .query(`SELECT familycode, username, email FROM users WHERE email = ?;`,[email])
    .then((res) => {
      return res[0];   
    });
  };



// Create Exisiting Family user
const ExistSignupModel = async ({ familycode, username, email, password }) => {
  await db.query(
    `INSERT INTO users (familycode, username, email, password) VALUES (?, ?, ?, ?);`,
    [familycode, username, email, password]
  );

  return await db
    .query(`SELECT familycode, username, email FROM users WHERE email = ?;`,[email])
    .then((res) => {
      return res[0];   
    });
  };

  
  module.exports = { NewsignupModel,ExistSignupModel, isExists, findFamily};