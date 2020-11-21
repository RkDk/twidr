
exports.up = async function(knex) {
  if (await knex.schema.hasTable('images')) {
    return;
  }
  await knex.schema.createTable('images', table => {
    table.increments('id').primary();
    table.string('path').notNullable();
    table.timestamp('createdAt', {useTz: false}).defaultTo(knex.fn.now());
    table.timestamp('updatedAt', {useTz: false}).defaultTo(knex.fn.now());
  });
};

exports.down = async function(knex) {
  if (!await knex.schema.hasTable('images')) {
    return;
  }
  knex.schema.dropTable('images');
};
