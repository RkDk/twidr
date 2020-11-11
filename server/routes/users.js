const express = require( 'express' );
const router = express.Router();
const User = require( '../models/User' );
const UserFollower = require( '../models/UserFollower' );

router.get( '/', async( request, response, next ) => {
  try {
    const users = await User.query().modify( 'defaultSelects' );
    response.status( 200 ).json( users );
  } catch ( err ) {
    next( err );
  }
} );

router.get( '/:userId', async( request, response, next ) => {
  try {
    const user =
      await User
        .query()
        .findById( request.params.userId )
        .modify( 'defaultSelects' );
    response.status( 200 ).json( user );
  } catch ( err ) {
    next( err );
  }
} );

router.get( '/:userId/followers', async( request, response, next ) => {
  try {
    const { offset = null, limit = null } = request.query;
    const followers =
      await UserFollower
        .query()
        .where( {
          followeeId: request.params.userId
        } )
        .modify( builder => {
          builder.orderBy( 'createdAt', 'desc' );
          if ( offset ) {
            builder.where( 'createdAt', '<', offset );
          }
          if ( limit ) {
            builder.limit( limit );
          }
        } )
        .select( 'createdAt' )
        .withGraphFetched( '[follower(defaultSelects)]' );
    response.status( 200 ).json( followers );
  } catch ( err ) {
    next( err );
  }
} );

router.post( '/:userId/follow', async( request, response, next ) => {
  try {
    const user =
      await User
        .query()
        .findById( request.params.userId );
    if ( user ) {
      await UserFollower
        .query()
        .insert( {
          followerId: request.activeUser.id,
          followeeId: user.id
        } );
    }
    response.sendStatus( 200 );
  } catch ( err ) {
    next( err );
  }
} );

module.exports = router;
