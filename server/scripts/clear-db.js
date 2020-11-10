async function clearDb() {
  const Knex = require('knex');
  const knexConfig = require('../knexfile');
  const knex = new Knex(knexConfig);

  await knex('postMetrics').del();
  await knex('posts').del();
  await knex('userFollowers').del();
  await knex('users').where('id', '>', 2).del();
  await knex('images').where('id', '>', 2).del();

  knex.destroy();
}

clearDb();
