require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5002;
const cors = require("cors");

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routers
const userRouter = require("./router/userrouter");
const postRouter = require("./router/postRouter");

// Use routers correctly
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);

// Test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
