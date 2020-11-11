
exports.up = async function( knex ) {
  if ( await knex.schema.hasTable( 'posts' ) ) {
    return;
  }
  await knex.schema.createTable( 'posts', table => {
    table.increments( 'id' ).primary();
    table.integer( 'userId' ).unsigned().notNullable();
    table.string( 'content' ).notNullable();
    table.timestamp( 'createdAt', { useTz: false } ).defaultTo( knex.fn.now() );
    table.timestamp( 'updatedAt', { useTz: false } ).defaultTo( knex.fn.now() );
    table.foreign( 'userId' ).references( 'users.id' );
  } );
};

exports.down = async function( knex ) {
  if ( !await knex.schema.hasTable( 'posts' ) ) {
    return;
  }
  knex.schema.dropTable( 'posts' );
};
