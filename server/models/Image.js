const { Model } = require('objection');

class Image extends Model {
  static get tableName() {
    return 'images';
  }

  static get idColumn() {
    return 'id';
  }

  static get virtualAttributes() {
    return ['url'];
  }

  get url() {
    return 'http://localhost:3000/'.concat(this.path);
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        id: { type: 'integer' },
        path: { type: 'string' }
      }
    };
  }

  static get modifiers() {
    return {
      selectUrl(builder) {
        builder.select('path').runAfter(result => {
          if (result.length) {
            result[0].onlyUrl = true;
          }
        });
      }
    };
  }

  $formatJson(json) {
    json = super.$formatJson(json);
    if (json.onlyUrl && json.url) {
      json = {
        url: json.url
      };
    }
    return json;
  }
};

module.exports = Image;
