const debug = require('debug')('twidr:user-cache');
const CacheService = require('./CacheService');
const UserFollower = require('../models/UserFollower');
const User = require('../models/User');

const USER_FOLLOWERS = 1;
const USER_FOLLOWINGS = 2;

function getUserFollowKey(userId, followType) {
  const field = followType === USER_FOLLOWERS ? 'follower' : 'following';
  return `user:${userId}:${field}:ids`;
}

async function fetchUserFollows(userId, followType, dateOffset, limit) {
  const whereKey = followType === USER_FOLLOWERS ? 'followeeId' : 'followerId';
  const selectKey = followType === USER_FOLLOWERS ? 'followerId' : 'followeeId';
  let nextOffset;
  const userIds = await UserFollower
    .query()
    .where({
      [whereKey]: userId
    })
    .modify(builder => {
      builder.orderBy('createdAt', 'desc');
    })
    .select([selectKey, 'createdAt'])
    .then(async rows => {
      const cacheValues = [];
      const userIds = [];
      rows.forEach((row, index) => {
        const timestamp = +Date.parse(row.createdAt);
        cacheValues[index * 2] = timestamp;
        cacheValues[index * 2 + 1] = row[selectKey];
        if (timestamp < dateOffset && limit-- > 0) {
          nextOffset = timestamp;
          userIds.push(row[selectKey]);
        }
      });
      await CacheService.addSortedSetValues(getUserFollowKey(userId, followType), cacheValues);
      return userIds;
    });
  return {nextOffset, userIds};
}

async function getFollowsWithType(userId, followType, dateOffset, limit, getUsers) {
  const key = getUserFollowKey(userId, followType);
  if (!await CacheService.keyExists(key)) {
    debug(`User follows cache-miss for ${key}`);
    const {nextOffset, userIds} = await fetchUserFollows(userId, followType, dateOffset, limit);
    const users = await getUsers(userIds);
    return {nextOffset, users};
  } else {
    debug(`Fetching user follows from cache for ${key}`);
    const followingIds = await CacheService.getReverseSortedSetByRangeScore(key, `(${dateOffset}`, null, limit, true);
    const nextOffset = followingIds[followingIds.length - 1];
    const userIds = [];
    for (let i = 0; i < followingIds.length; i += 2) {
      userIds.push(followingIds[i]);
    }
    const users = await getUsers(userIds);
    return {nextOffset, users};
  }
}

class UserCacheService {
  async getUser(id) {
    return this.getUsers([id]);
  }

  async getUsers(ids) {
    const users = await CacheService.getJsonMultiple(ids.map(id => `user:${id}`));
    const cacheMisses = users.map((user, index) => user ? null : ids[index]).filter(v => !!v);
    debug(`Querying for ${ids.length} users with ${cacheMisses.length} cache-misses`);
    const loadedUsers = !cacheMisses.length ? []
      : await User
        .query()
        .joinRaw(`JOIN unnest('{${cacheMisses.join(',')}}'::int[]) WITH ORDINALITY t(id, ord) USING (id)`)
        .orderByRaw('t.ord')
        .modify('defaultSelects');
    for (const user of loadedUsers) {
      debug('Filling user cache-miss for ', user.id);
      await CacheService.setJson(`user:${user.id}`, user);
    }
    return users.map(user => {
      return user || loadedUsers.shift();
    });
  }

  async getFollowings(userId, dateOffset, limit) {
    return getFollowsWithType(userId, USER_FOLLOWINGS, dateOffset, limit, this.getUsers.bind(this));
  }

  async getFollowers(userId, dateOffset, limit) {
    return getFollowsWithType(userId, USER_FOLLOWERS, dateOffset, limit, this.getUsers.bind(this));
  }
}

module.exports = new UserCacheService();
