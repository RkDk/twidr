
exports.up = async function (knex) {
  if (await knex.schema.hasTable('users')) {
    return;
  }
  await knex.schema.createTable('users', table => {
    table.increments('id').primary();
    table.string('name');
  });
};

exports.down = async function (knex) {
  if (!await knex.schema.hasTable('users')) {
    return;
  }
  knex.schema.dropTable('users');
};
