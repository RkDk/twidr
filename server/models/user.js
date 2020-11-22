const {Model} = require('objection');
const BaseModel = require('./BaseModel');
const Image = require('./Image');
const _ = require('lodash');

class User extends BaseModel {
  static get tableName() {
    return 'users';
  }

  static get idColumn() {
    return 'id';
  }

  static get virtualAttributes() {
    return ['followingIds'];
  }

  get followingIds() {
    if (!this.following) {
      return null;
    }
    return this.following.map(v => v.id);
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'handle'],
      properties: {
        id: {type: 'integer', readOnly: true},
        handle: {type: 'string', minLength: 4, maxLength: 255},
        name: {type: 'string', minLength: 4, maxLength: 255},
        bio: {type: 'string', maxLength: 255},
        imageId: {type: 'integer'},
        updatedAt: {type: 'timestamp', readOnly: true}
      }
    };
  }

  static get modifiers() {
    return {
      defaultSelects(builder) {
        builder.select('id', 'name', 'bio', 'handle').withGraphFetched('profileImage(selectUrl)');
      },
      followingIds(builder) {
        builder.withGraphFetched('following').modifyGraph('following', builder => {
          builder.select('users.id');
        });
      }
    };
  }

  static get relationMappings() {
    return {
      profileImage: {
        relation: Model.HasOneRelation,
        modelClass: Image,
        join: {
          from: 'users.imageId',
          to: 'images.id'
        }
      },
      following: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: 'users.id',
          through: {
            from: 'userFollowers.followerId',
            to: 'userFollowers.followeeId'
          },
          to: 'users.id'
        }
      }
    };
  };

  $formatJson(json) {
    json = super.$formatJson(json);
    return _.pick(json, Object.keys(json).filter(key => key !== 'following'));
  }
};

module.exports = User;
