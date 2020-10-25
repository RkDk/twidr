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
        id: { type: 'integer' },
        handle: { type: 'string' },
        name: { type: 'string' },
        imageId: { type: 'integer' },
        updatedAt: { type: 'timestamp' }
      }
    };
  }

  static get modifiers() {
    return {
      defaultSelects(builder) {
        builder.select('name', 'handle').withGraphFetched('profileImage(selectUrl)');
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
