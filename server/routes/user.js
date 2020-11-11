const express = require( 'express' );
const router = express.Router();

router.get( '/', async( request, response, next ) => {
  try {
    response.status( 200 ).json( request.activeUser );
  } catch ( err ) {
    next( err );
  }
} );

module.exports = router;
