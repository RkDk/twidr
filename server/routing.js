const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const userAuthentication = require('./middleware/userAuthentication');
const { request } = require('express');
const debug = require('debug')('twidr:routing');

const routeMappings = [
  'newsfeed',
  'posts',
  'user',
  'users'
];

module.exports = (server) => {
  server.use((request, response, next) => {
    debug('Received request ' + request.url);
    response.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    response.header('Access-Control-Allow-Credentials', 'true');
    response.header('Access-Control-Allow-Headers', 'Authorization, Cookie, Origin, X-Requested-With, Content-Type, Accept');
    if (request.method === 'OPTIONS') {
      return response.sendStatus(200);
    }
    next();
  });
  server.use(cookieParser());
  server.use(userAuthentication);
  server.use(bodyParser.json());
  routeMappings.forEach(route => {
    server.use(`/${route}`, require(`./routes/${route}`));
  });
  server.use((request, response, next) => {
    response.sendStatus(404);
  });
  server.use((err, request, response, next) => {
    if (err) {
      debug(`An error was encountered: ${err.stack}`);
    }
    response.sendStatus(500);
  });
  debug('Setup routes');
};
