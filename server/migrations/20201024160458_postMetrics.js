
exports.up = async function( knex ) {
  if ( await knex.schema.hasTable( 'postMetrics' ) ) {
    return;
  }
  await knex.schema.createTable( 'postMetrics', table => {
    table.increments( 'id' ).primary();
    table.integer( 'postId' ).unsigned().notNullable();
    table.integer( 'likes' ).unsigned().notNullable().defaultTo( 0 );
    table.integer( 'shares' ).unsigned().notNullable().defaultTo( 0 );
    table.integer( 'replies' ).unsigned().notNullable().defaultTo( 0 );
    table.foreign( 'postId' ).references( 'posts.id' );
  } );
};

exports.down = async function( knex ) {
  if ( !await knex.schema.hasTable( 'postMetrics' ) ) {
    return;
  }
  knex.schema.dropTable( 'postMetrics' );
};
