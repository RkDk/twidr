const User = require('../models/User');

class UserService {
  authenticateSession(userId, sessionCode) {
    const user = User.query().findById(userId).modify('defaultSelects');
    return user;
  }
}

module.exports = new UserService();
