const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Utils = require('../utils');
const PostCacheService = require('../services/PostCacheService');
const UserCacheService = require('../services/UserCacheService');

router.get('/', async(request, response, next) => {
  try {
    const {offset, limit = 10} = request.query;
    const dateOffset = Utils.getUnixTime(offset);
    if (isNaN(dateOffset)) {
      throw new Error('offset is invalid');
    }
    const results =
      await Post
        .query()
        .modify(builder => {
          builder.orderBy('createdAt', 'desc');
          if (offset) {
            builder.where('createdAt', '<', new Date(dateOffset));
          }
          if (limit) {
            builder.limit(limit);
          }
        })
        .select(['id', 'userId']);

    const posts = await PostCacheService.getPosts(results.map(v => v.id));
    const users = await UserCacheService.getUsers([...new Set(results.map(v => v.userId))]);
    const nextOffset = Utils.getUnixTime(posts[posts.length - 1].createdAt);
    response.status(200).json({nextOffset, items: [users, posts]});
  } catch (err) {
    next(err);
  }
});

module.exports = router;
