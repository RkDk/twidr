const debug = require('debug')('twidr:cache');
const redis = require('redis');
const rejson = require('redis-rejson');
const util = require('util');

rejson(redis);

function createClient() {
  const client = redis.createClient();
  client.on('ready', () => {
    debug('Client connection to redis established');
  });
  client.on('end', () => {
    debug('Client connection to redis ended');
  });
  client.on('error', err => {
    debug(`redis error has occurred: ${err.toString()}`);
  });
  return client;
}

class CacheService {
  constructor() {
    this.client = createClient();
    this.json_set = util.promisify(this.client.json_set).bind(this.client);
    this.json_get = util.promisify(this.client.json_get).bind(this.client);
  }

  setJson(key, value) {
    return this.json_set(key, '.', JSON.stringify(value));
  }

  getJson(key) {
    return this.json_get(key);
  }
};

module.exports = new CacheService();
