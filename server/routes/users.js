const express = require('express');
const router = express.Router();
const User = require('../models/User');
const UserFollower = require('../models/UserFollower');
const CacheService = require('../services/CacheService');

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

async function getUsers(ids) {
  const users = await CacheService.getJsonMultiple(ids.map(v => `user:${v}`));
  const cacheMisses = users.map((v, index) => v ? null : ids[index]).filter(v => !!v);
  const loadedUsers = !cacheMisses.length ? []
    : await User
      .query()
      .joinRaw(`JOIN unnest('{${ids.join(',')}}'::int[]) WITH ORDINALITY t(id, ord) USING (id)`)
      .orderByRaw('t.ord')
      .modify('defaultSelects');
  for (const user of loadedUsers) {
    await CacheService.setJson(`user:${user.id}`, user);
  }
  return users.map(user => {
    return user || loadedUsers.shift();
  });
}

router.get('/:userId/following', async(request, response, next) => {
  try {
    const {offset: dateOffset = null, limit = 10} = request.query;
    const dateMs = dateOffset ? +new Date(+dateOffset) : +new Date();
    if (isNaN(dateMs)) {
      throw new Error('Date offset is invalid');
    }
    const key = `user:${request.params.userId}:following:ids`;
    if (!await CacheService.keyExists(key)) {
      let nextOffset;
      const userIds = await UserFollower
        .query()
        .where({
          followerId: request.params.userId
        })
        .modify(builder => {
          builder.orderBy('createdAt', 'desc');
        })
        .select(['followeeId', 'createdAt'])
        .then(async rows => {
          const values = [];
          const userIds = [];
          let count = 0;
          rows.forEach((row, index) => {
            const timestamp = +Date.parse(row.createdAt);
            values[index * 2] = timestamp;
            values[index * 2 + 1] = row.followeeId;
            if (timestamp < dateMs && count++ < limit) {
              nextOffset = timestamp;
              userIds.push(row.followeeId);
            }
          });
          await CacheService.addSortedSetValues(key, values);
          return userIds;
        });
      const users = await getUsers(userIds);
      response.status(200).send({
        nextOffset,
        items: users
      });
    } else {
      const followingIds = await CacheService.getReverseSortedSetByRangeScore(key, `(${dateMs}`, null, limit, true);
      const nextOffset = followingIds[followingIds.length - 1];
      const userIds = [];
      for (let i = 0; i < followingIds.length; i += 2) {
        userIds.push(followingIds[i]);
      }
      const users = await getUsers(userIds);
      response.status(200).send({
        nextOffset,
        items: users
      });
    }
  } catch (err) {
    next(err);
  }
});

router.get('/:userId/followers', async(request, response, next) => {
  try {
    const {offset = null, limit = null} = request.query;
    const followers =
      await UserFollower
        .query()
        .where({
          followeeId: request.params.userId
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
        .select('createdAt')
        .withGraphFetched('[follower(defaultSelects)]');
    response.status(200).json(followers);
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
