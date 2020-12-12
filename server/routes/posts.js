const express = require('express');
const Post = require('../models/Post');
const Utils = require('../utils');
const UserCacheService = require('../services/UserCacheService');
const PostCacheService = require('../services/PostCacheService');
const router = express.Router();

router.get('/', async(request, response, next) => {
  try {
    const {userId, offset, limit = 10} = request.query;
    const dateOffset = Utils.getUnixTime(offset);
    if (isNaN(dateOffset)) {
      throw new Error('offset is invalid');
    }
    const {nextOffset, posts} = await UserCacheService.getUserPosts(userId, dateOffset, limit);
    const users = await UserCacheService.getUsers([...new Set(posts.map(v => v.userId))]);
    response.status(200).json({nextOffset, items: [users, posts]});
  } catch (err) {
    next(err);
  }
});

router.get('/:postId', async(request, response, next) => {
  try {
    const {postId} = request.params;
    const post = await PostCacheService.getPost(postId);
    const user = await UserCacheService.getUser(post.userId);
    response.status(200).json({user, post});
  } catch (err) {
    next(err);
  }
});

router.post('/', async(request, response, next) => {
  try {
    const {activeUser, body} = request;
    const {id} = activeUser;
    const {content} = body;
    const post =
      await Post
        .query()
        .insertGraph({
          userId: id,
          content,
          metrics: {}
        })
        .modify('defaultSelects')
        .modify('aggregateUsers');
    await UserCacheService.addUserPost(id, post.post);
    response.status(200).json(post);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
