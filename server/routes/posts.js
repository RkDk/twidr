const express = require('express');
const Post = require('../models/Post');
const router = express.Router();

router.get('/', async(request, response) => {
  const { userId = null, offset = null, limit = null } = request.query;
  const posts =
    await Post
      .query()
      .where({
        userId: userId || request.activeUser.id
      })
      .modify(builder => {
        builder.orderBy('createdAt', 'desc');
        if (offset) {
          builder.where('createdAt', '<', offset);
        }
        if (limit) {
          builder.limit(limit);
        }
      })
      .modify('defaultSelects')
      .modify('aggregateUsers');
  response.status(200).json(posts);
});

router.post('/', async(request, response) => {
  const { activeUser, body } = request;
  const { id } = activeUser;
  const { content } = body;
  const post = await Post.query()
    .insertGraph({
      userId: id,
      content,
      metrics: {}
    })
    .modify('defaultSelects')
    .modify('aggregateUsers');
  response.status(200).json(post);
});

module.exports = router;
