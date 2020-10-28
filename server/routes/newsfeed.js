const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.get('/', async(request, response) => {
  const { offset = null, limit = null } = request.query;
  const posts =
    await Post
      .query()
      .modify('defaultSelects')
      .modify('aggregateUsers')
      .modify(builder => {
        if (offset) {
          builder.where('createdAt', '<', offset);
          builder.orderBy('createdAt', 'desc');
        }
        if (limit) {
          builder.limit(limit);
        }
      });
  response.status(200).json(posts);
});

module.exports = router;
