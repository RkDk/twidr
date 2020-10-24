const debug = require('debug')('twidr:server');
const express = require('express');
const {
  SERVER_PORT = 3000
} = require('./constants/server');

module.exports = () => {
  const server = express();
  server.listen(SERVER_PORT, () => {
    debug(`Server listening on port ${SERVER_PORT}`);
  });
  return server;
};
