
exports.up = async function( knex ) {
  if ( await knex.schema.hasTable( 'users' ) ) {
    return;
  }
  await knex.schema.createTable( 'users', table => {
    table.increments( 'id' ).primary();
    table.string( 'name' ).notNullable();
    table.string( 'handle' ).notNullable();
    table.string( 'bio' );
    table.integer( 'imageId' ).unsigned();
    table.timestamp( 'createdAt', { useTz: false } ).defaultTo( knex.fn.now() );
    table.timestamp( 'updatedAt', { useTz: false } ).defaultTo( knex.fn.now() );
    table.foreign( 'imageId' ).references( 'images.id' );
  } );
};

exports.down = async function( knex ) {
  if ( !await knex.schema.hasTable( 'users' ) ) {
    return;
  }
  knex.schema.dropTable( 'users' );
};
