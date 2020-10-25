const BaseModel = require('./BaseModel');

class PostMetric extends BaseModel {
  static get tableName() {
    return 'postMetrics';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['postId', 'likes', 'shares', 'replies'],
      properties: {
        id: { type: 'integer' },
        postId: { type: 'integer' },
        likes: { type: 'integer' },
        shares: { type: 'integer' },
        replies: { type: 'integer' }
      }
    };
  }

  static get modifiers() {
    return {
      defaultSelects(builder) {
        builder.select('likes', 'shares', 'replies');
      }
    };
  }
};

module.exports = PostMetric;
