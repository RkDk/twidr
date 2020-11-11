function randomNumber( max ) {
  return Math.floor( Math.random() * max );
}

async function generatePosts( n ) {
  const faker = require( 'faker' );
  const Knex = require( 'knex' );
  const knexConfig = require( '../knexfile' );
  const knex = new Knex( knexConfig );
  try {
    for ( let i = 0; i < n; i++ ) {
      const content = faker.lorem.sentences().substring( 0, 255 );
      const createdAt = faker.date.past();

      const likes = randomNumber( 30 );
      const replies = randomNumber( 30 );
      const shares = randomNumber( 30 );

      const userIds = await knex( 'users' ).select( 'id' );
      const { id: userId } = userIds[randomNumber( userIds.length )];

      const [postId] =
        await knex( 'posts' )
          .insert( {
            content,
            userId,
            createdAt
          } )
          .returning( 'id' );

      await knex( 'postMetrics' )
        .insert( {
          postId,
          likes,
          replies,
          shares
        } );
    }
  } catch ( err ) {
    console.log( err );
  }
  knex.destroy();
}

const { argv } = process;
const arg = argv.length > 2 && argv[2].includes( 'number=' ) > -1 && +argv[2].split( 'number=' )[1].trim();

if ( isNaN( arg ) || arg < 1 ) {
  console.log( 'A valid number of posts (above 0) must be specified with `number` (ie. number=3)' );
} else {
  generatePosts( arg );
}
