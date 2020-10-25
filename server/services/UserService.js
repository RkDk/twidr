class UserService {
  authenticateSession(userId, sessionCode) {
    return {
      userId: 1,
      profileImage: 'https://media-exp1.licdn.com/dms/image/C5603AQHOYtPkkpA31w/profile-displayphoto-shrink_400_400/0?e=1608768000&v=beta&t=YjMpXrcybPO97osN4ecsx7BpDRFj9iF9h1nPN346sfM',
      fullName: 'Rick Chou',
      userHandle: 'rickchou',
      bio: "I'm a technologist"
    };
  }
}

module.exports = new UserService();
