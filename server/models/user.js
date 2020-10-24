const { Model } = require('objection');

class User extends Model {
  static get tableName () {
    return 'users';
  }

  static get idColumn () {
    return 'id';
  }

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' }
      }
    };
  }
};

module.exports = User;
