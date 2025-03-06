const db = require("../utility/database");


const addPostModel = async (caption, imagePath, username) => {
  
  try {
    // Get user details
    const [userResult]= await db.query(
      "SELECT username FROM users WHERE user_id = ?",
      [username]
    );

    
    // Insert post
    const [result] = await db.query(
      "INSERT INTO posts (caption, img_path, username, created_at) VALUES (?, ?, ?, NOW())",
      [caption, imagePath, username]
    );

    // Get the created post
    const [newPost] = await db.query(
      "SELECT * FROM posts WHERE post_id = ?",
      [result.insertId]
    );

    return newPost[0];
  } catch (error) {
    console.error("Error in addPostModel:", error);
    throw error;
  }
};

module.exports = {
  addPostModel,

};