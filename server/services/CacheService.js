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

    this.sadd = util.promisify(this.client.sadd).bind(this.client);
    this.scard = util.promisify(this.client.scard).bind(this.client);
    this.exists = util.promisify(this.client.exists).bind(this.client);
    this.get = util.promisify(this.client.get).bind(this.client);
    this.set = util.promisify(this.client.set).bind(this.client);
    this.smembers = util.promisify(this.client.smembers).bind(this.client);
    this.json_mget = util.promisify(this.client.json_mget).bind(this.client);
    this.json_set = util.promisify(this.client.json_set).bind(this.client);
    this.json_get = util.promisify(this.client.json_get).bind(this.client);
    this.zadd = util.promisify(this.client.zadd).bind(this.client);
    this.zcard = util.promisify(this.client.zcard).bind(this.client);
    this.zrevrange = util.promisify(this.client.zrevrange).bind(this.client);
    this.zrevrangebyscore = util.promisify(this.client.zrevrangebyscore).bind(this.client);
    this.zrange = util.promisify(this.client.zrange).bind(this.client);
    this.zrangebyscore = util.promisify(this.client.zrangebyscore).bind(this.client);
    this.zscore = util.promisify(this.client.zscore).bind(this.client);
  }

  keyExists(key) {
    return this.exists(key);
  }

  getValue(key, value) {
    return this.getJson(key);
  }

  setValue(key, value) {
    return this.set(key, value);
  }

  addSetValues(key, value) {
    const values = Array.isArray(value) ? value : [value];
    return this.sadd(key, ...values);
  }

  getSetValues(key) {
    return this.smembers(key);
  }

  getSetLength(key) {
    return this.scard(key);
  }

  setJson(key, value) {
    return this.json_set(key, '.', JSON.stringify(value));
  }

  getJson(key) {
    return this.json_get(key).then(v => v ? JSON.parse(v) : null);
  }

  getJsonMultiple(keys) {
    return this.json_mget(...keys, '.').then(rows => rows.map(v => v ? JSON.parse(v) : null));
  }

  addSortedSetValues(key, values) {
    return this.zadd(key, ...values);
  }

  getSortedSetLength(key) {
    return this.zcard(key);
  }

  getSortedSetByRange(key, min, max, limit, withScores = false) {
    const args = [key, min, max || '+inf'];
    if (withScores) {
      args.push('WITHSCORES');
    }
    if (limit) {
      args.push(...['LIMIT', 0, limit]);
    }
    return this.zrange(...args);
  }

  getSortedSetByRangeScore(key, min, max, limit, withScores = false) {
    const args = [key, min, max || '+inf'];
    if (withScores) {
      args.push('WITHSCORES');
    }
    if (limit) {
      args.push(...['LIMIT', 0, limit]);
    }
    return this.zrangebyscore(...args);
  }

  getReverseSortedSetByRange(key, min, max, limit, withScores = false) {
    const args = [key, String(max), min || '-inf'];
    if (withScores) {
      args.push('WITHSCORES');
    }
    if (limit) {
      args.push(...['LIMIT', 0, limit]);
    }
    return this.zrevrange(...args);
  }

  getReverseSortedSetByRangeScore(key, max, min, limit, withScores = false) {
    const args = [key, String(max), min || '-inf'];
    if (withScores) {
      args.push('WITHSCORES');
    }
    if (limit) {
      args.push(...['LIMIT', 0, limit]);
    }
    return this.zrevrangebyscore(...args);
  }

  getHighestScore(key) {
    return this.zrange(key, -1, -1, 'WITHSCORES').then(v => v.pop());
  }

  getLowestScore(key) {
    return this.zrange(key, 0, 0, 'WITHSCORES').then(v => v.pop());
  }

  getScore(key, member) {
    return this.zscore(key, member);
  }
};

module.exports = new CacheService();
