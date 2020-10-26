const { Model } = require('objection');
const BaseModel = require('./BaseModel');
const Image = require('./Image');

class User extends BaseModel {
  static get tableName() {
    return 'users';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'handle'],
      properties: {
        id: { type: 'integer', readOnly: true },
        handle: { type: 'string', minLength: 4, maxLength: 255 },
        name: { type: 'string', minLength: 4, maxLength: 255 },
        bio: { type: 'string', maxLength: 255 },
        imageId: { type: 'integer' },
        updatedAt: { type: 'timestamp', readOnly: true }
      }
    };
  }

  static get modifiers() {
    return {
      defaultSelects(builder) {
        builder.select('id', 'name', 'bio', 'handle').withGraphFetched('profileImage(selectUrl)');
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
      }
    };
  };
};

module.exports = User;
