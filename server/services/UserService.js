const User = require('../models/User');

class UserService {
  authenticateSession(userId, sessionCode) {
    const user = User.query().findById(userId).modify('defaultSelects').modify('followingIds');
    return user;
  }
}

module.exports = new UserService();
