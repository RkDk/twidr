
exports.up = async function(knex) {
  if (await knex.schema.hasTable('userFollowers')) {
    return;
  }
  await knex.schema.createTable('userFollowers', table => {
    table.increments('id').primary();
    table.integer('followerId').unsigned().notNullable();
    table.integer('followeeId').unsigned().notNullable();
    table.foreign('followerId').references('users.id');
    table.foreign('followeeId').references('users.id');
    table.timestamp('createdAt', { useTz: false }).defaultTo(knex.fn.now());
    table.index('followerId');
    table.index('followeeId');
    table.unique(['followerId', 'followeeId']);
  });
};

exports.down = async function(knex) {
  if (!await knex.schema.hasTable('userFollowers')) {
    return;
  }
  knex.schema.dropTable('userFollowers');
};
