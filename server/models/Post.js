const {Model} = require('objection');
const BaseModel = require('./BaseModel');
const PostMetric = require('./PostMetric');
const User = require('./User');
const _ = require('lodash');

class Post extends BaseModel {
  static get tableName() {
    return 'posts';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['userId', 'content'],
      properties: {
        id: {type: 'integer', readOnly: true},
        userId: {type: 'integer'},
        content: {type: 'string', minLength: 1, maxLength: 255},
        createdAt: {type: 'timestamp', readOnly: true},
        updatedAt: {type: 'timestamp', readOnly: true}
      }
    };
  }

  static get modifiers() {
    return {
      defaultSelects(builder) {
        builder
          .select('id', 'content', 'createdAt', 'userId')
          .withGraphFetched('[user(defaultSelects),metrics(defaultSelects)]');
      },
      aggregateUsers(builder) {
        builder.runAfter(response => {
          if (!Array.isArray(response)) {
            return {user: response.user, post: _.pick(response, Object.keys(response).filter(key => key !== 'user'))};
          }
          const users = [];
          const posts = response.map(post => {
            if (!users.some(({id}) => id === post.userId)) {
              users.push(post.user);
            }
            return _.pick(post, Object.keys(post).filter(key => key !== 'user'));
          });
          return {users, posts};
        });
      }
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'posts.userId',
          to: 'users.id'
        }
      },
      metrics: {
        relation: Model.HasOneRelation,
        modelClass: PostMetric,
        join: {
          from: 'postMetrics.postId',
          to: 'posts.id'
        }
      }
    };
  };
};

module.exports = Post;
