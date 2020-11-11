const express = require( 'express' );
const router = express.Router();
const Post = require( '../models/Post' );

router.get( '/', async( request, response, next ) => {
  try {
    const { offset = null, limit = null } = request.query;
    const posts =
      await Post
        .query()
        .modify( builder => {
          builder.orderBy( 'createdAt', 'desc' );
          if ( offset ) {
            builder.where( 'createdAt', '<', offset );
          }
          if ( limit ) {
            builder.limit( limit );
          }
        } )
        .modify( 'defaultSelects' )
        .modify( 'aggregateUsers' );
    response.status( 200 ).json( posts );
  } catch ( err ) {
    next( err );
  }
} );

module.exports = router;
