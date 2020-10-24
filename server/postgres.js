const debug = require('debug')('twidr:postgres');
const knexConfig = require('./knexfile');
const Knex = require('knex');
const { Model } = require('objection');

module.exports = () => {
  const knex = new Knex(knexConfig);
  Model.knex(knex);
  debug('Setup postgres');
};
