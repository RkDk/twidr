const setupServer = require( './server' );
const setupRouting = require( './routing' );
const setupPostgres = require( './postgres' );

const server = setupServer();
setupRouting( server );
setupPostgres();
