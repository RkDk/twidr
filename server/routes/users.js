const express = require('express');
const router = express.Router();
const User = require('../models/User');
const UserFollower = require('../models/UserFollower');
const UserCacheService = require('../services/UserCacheService');
const Utils = require('../utils');

router.get('/', async(request, response, next) => {
  try {
    const users = await User.query().modify('defaultSelects');
    response.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

router.get('/:userId', async(request, response, next) => {
  try {
    const user =
      await User
        .query()
        .findById(request.params.userId)
        .modify('defaultSelects');
    response.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

router.get('/:userId/following', async(request, response, next) => {
  try {
    const {offset, limit = 10} = request.query;
    const dateOffset = Utils.getUnixTime(offset);
    if (isNaN(dateOffset)) {
      throw new Error('offset is invalid');
    }
    const {nextOffset, users: items} = await UserCacheService.getFollowings(request.params.userId, dateOffset, limit);
    response.status(200).json({nextOffset, items});
  } catch (err) {
    next(err);
  }
});

router.get('/:userId/followers', async(request, response, next) => {
  try {
    const {offset, limit = 10} = request.query;
    const dateOffset = Utils.getUnixTime(offset);
    if (isNaN(dateOffset)) {
      throw new Error('offset is invalid');
    }
    const {nextOffset, users: items} = await UserCacheService.getFollowers(request.params.userId, dateOffset, limit);
    response.status(200).json({nextOffset, items});
  } catch (err) {
    next(err);
  }
});

router.post('/:userId/follow', async(request, response, next) => {
  try {
    if (isNaN(+request.params.userId)) {
      throw new Error('Invalid userId');
    }
    await UserFollower
      .query()
      .insert({
        followerId: request.activeUser.id,
        followeeId: +request.params.userId
      });
    response.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

router.post('/:userId/unfollow', async(request, response, next) => {
  try {
    if (isNaN(+request.params.userId)) {
      throw new Error('Invalid userId');
    }
    await UserFollower
      .query()
      .delete()
      .where({
        followerId: request.activeUser.id,
        followeeId: +request.params.userId
      });
    response.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
