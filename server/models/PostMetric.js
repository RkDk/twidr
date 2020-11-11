const BaseModel = require( './BaseModel' );

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
      required: ['postId'],
      properties: {
        id: { type: 'integer', readOnly: true },
        postId: { type: 'integer' },
        likes: { type: 'integer', minimum: 0 },
        shares: { type: 'integer', minimum: 0 },
        replies: { type: 'integer', minimum: 0 }
      }
    };
  }

  static get modifiers() {
    return {
      defaultSelects( builder ) {
        builder.select( 'likes', 'shares', 'replies' );
      }
    };
  }
};

module.exports = PostMetric;
