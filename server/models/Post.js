const { Model } = require('objection');
const BaseModel = require('./BaseModel');
const PostMetric = require('./PostMetric');
const User = require('./User');

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
        id: { type: 'integer' },
        userId: { type: 'integer' },
        content: { type: 'string' },
        createdAt: { type: 'timestamp' },
        updatedAt: { type: 'timestamp' }
      }
    };
  }

  static get modifiers() {
    return {
      defaultSelects(builder) {
        builder.select('content', 'createdAt').withGraphFetched('[user(defaultSelects),metrics(defaultSelects)]');
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
