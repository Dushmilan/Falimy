const jwt = require("jsonwebtoken");
const secretCode = process.env.JWT_SECRET;

const auth = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
   
    console.log("Full Authorization Header:", req.headers); // Extensive logging
   
    if (!token) {
      return res.status(401).json({ 
        message: "No authorization token",
        details: "Token not found in headers" 
      });
    }
    
    // Handle both "Bearer TOKEN" and just "TOKEN" formats
    token = token.includes('Bearer') ? token.split(" ")[1] : token;
    
    if (!token) {
        return res.status(401).json({ 
          message: "Invalid token format",
          details: "Could not extract token" 
        });
    }
    
    const decoded = jwt.verify(token, secretCode);
    
    console.log("Decoded Token:", decoded); 
    
    // Attach user information to the request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      username: decoded.username 
    };
    
    next();
  } catch (error) {
    console.error("Full Authentication Error:", error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: "Invalid token", 
        error: error.message 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: "Token expired", 
        error: error.message 
      });
    }
    
    return res.status(401).json({ 
      message: "Unauthorized", 
      error: error.message 
    });
  }
};

module.exports = auth;