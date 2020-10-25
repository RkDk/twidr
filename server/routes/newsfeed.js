const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.get('/', async(request, response) => {
  const posts = await Post.query().modify('defaultSelects');
  response.status(200).json(posts);
});

module.exports = router;
