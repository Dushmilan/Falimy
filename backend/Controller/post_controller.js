const addPostModel = require("../Model/PostModel");


const addPostHandler = async (req, res) => {
  try {
    console.log("Full Request User:", req.user); // Debugging log
    console.log("Request Body:", req.body); // Log the request body
    console.log("Uploaded File:", req.file); // Log file upload details

    // Destructure caption, use fallback if not found
    const caption = req.body.caption || req.body.text || '';
    
    // Use email as fallback if username not available
    const username = req.user?.username || req.user?.email;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!caption) {
      return res.status(400).json({
        success: false,
        message: "Caption is required"
      });
    }

    if (!username) {
      return res.status(401).json({
        success: false,
        message: "Authentication required: No username found"
      });
    }

    if (!imagePath) {
      return res.status(400).json({
        success: false,
        message: "Image is required"
      });
    }

    const newPost = await addPostModel(caption, imagePath, username);
   
    res.status(200).json({
      success: true,
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.error("Error in addPostHandler:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error creating post",
    });
  }
};

  module.exports={addPostHandler,};