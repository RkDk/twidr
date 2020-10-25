const debug = require('debug')('twidr:postgres');
const knexConfig = require('./knexfile');
const Knex = require('knex');
const { Model } = require('objection');
const { types } = require('pg');

module.exports = () => {
  // Fixes pg bug where timestamp without tz data types are converted to Javascript Date objects which use timezone
  types.setTypeParser(1114, function(stringValue) {
    return stringValue;
  });

  const knex = new Knex(knexConfig);
  Model.knex(knex);
  debug('Setup postgres');
};
