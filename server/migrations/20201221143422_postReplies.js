
exports.up = async function(knex) {
  if (await knex.schema.hasColumn('posts', 'replyTo')) {
    return;
  }
  await knex.schema.table('posts', table => {
    table.integer('replyTo').unsigned().nullable();
    table.foreign('replyTo').references('posts.id');
    table.index('replyTo');
  });
};

exports.down = async function(knex) {
  if (!await knex.schema.hasColumn('posts', 'replyTo')) {
    return;
  }
  knex.schema.dropColumn('replyTo');
};
