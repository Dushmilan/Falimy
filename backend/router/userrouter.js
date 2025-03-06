const express = require("express");
const userRouter = express.Router();
const userHandler = require("../Controller/usercontroller");

userRouter.post("/newsignup", userHandler.NewsignupHandler);
userRouter.post("/existingSignup", userHandler.ExistingSignUpHandler);
userRouter.post("/login", userHandler.loginHandler);
module.exports = userRouter;