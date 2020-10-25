const UserService = require('../services/UserService');
const debug = require('debug')('twidr:middleware/userAuthentication');

module.exports = async(request, response, next) => {
  try {
    const { sessionId = '1-abc' } = request.cookies;

    if (!sessionId) {
      throw new Error('Failed to find user sessionId');
    }

    const [userId, sessionCode] = sessionId.split('-');

    if (!userId) {
      throw new Error('Failed to extract userId');
    }

    if (!sessionCode) {
      throw new Error('Failed to extract sessionCode');
    }

    const user = await UserService.authenticateSession(userId, sessionCode);

    if (!user) {
      throw new Error('Failed to validate user session');
    }

    request.activeUser = user;

    debug(`Authenticated request: ${request.method} ${request.path}`);
    next();
  } catch (err) {
    debug(err.toString());
    return response.sendStatus(401);
  }
};
