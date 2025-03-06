const express = require('express');
const PostHandler = require('../Controller/post_controller');
const postRouter = express.Router();
const middleware = require('../utility/Middleware/auth');


postRouter.post('/addpost',  PostHandler.addPostHandler);


module.exports= postRouter;