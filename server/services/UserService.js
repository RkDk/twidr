const User = require('../models/User');
const UserCacheService = require('./UserCacheService');

class UserService {
  async authenticateSession(userId, sessionCode) {
    const user = await UserCacheService.getUser(userId);
    const followingIds = await UserCacheService.getAllFollowingIds(userId);
    return {...user, followingIds};
  }
}

module.exports = new UserService();
