const {Model} = require('objection');
const BaseModel = require('./BaseModel');
const User = require('./User');

class UserFollower extends BaseModel {
  static get tableName() {
    return 'userFollowers';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['followerId', 'followeeId'],
      properties: {
        id: {type: 'integer', readOnly: true},
        followerId: {type: 'integer'},
        followeeId: {type: 'integer'},
        createdAt: {type: 'timestamp', readOnly: true}
      }
    };
  }

  static get relationMappings() {
    return {
      follower: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'userFollowers.followerId',
          to: 'users.id'
        }
      },
      followee: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'userFollowers.followeeId',
          to: 'users.id'
        }
      }
    };
  };
};

module.exports = UserFollower;
