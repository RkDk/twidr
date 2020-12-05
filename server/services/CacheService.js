const debug = require('debug')('twidr:cache');
const redis = require('redis');
const rejson = require('redis-rejson');
const util = require('util');

rejson(redis);

class RedisError extends Error {
  constructor(error) {
    super(error);
    this.name = 'Redis Error';
    this.message = `\n${error.stack} \n\nParams: ${JSON.stringify(error)}`;
  }
}

function onRedisError(err) {
  throw new RedisError(err);
}

function promisify(o, fn) {
  const pfn = util.promisify(o[fn]).bind(o);
  return (...args) => {
    return pfn(...args).catch(onRedisError);
  };
}

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

    this.sadd = promisify(this.client, 'sadd');
    this.scard = promisify(this.client, 'scard');
    this.exists = promisify(this.client, 'exists');
    this.get = promisify(this.client, 'get');
    this.set = promisify(this.client, 'set');
    this.smembers = promisify(this.client, 'smembers');
    this.json_mget = promisify(this.client, 'json_mget');
    this.json_set = promisify(this.client, 'json_set');
    this.json_get = promisify(this.client, 'json_get');
    this.zadd = promisify(this.client, 'zadd');
    this.zrem = promisify(this.client, 'zrem');
    this.zcard = promisify(this.client, 'zcard');
    this.zrevrange = promisify(this.client, 'zrevrange');
    this.zrevrangebyscore = promisify(this.client, 'zrevrangebyscore');
    this.zrange = promisify(this.client, 'zrange');
    this.zrangebyscore = promisify(this.client, 'zrangebyscore');
    this.zscan = promisify(this.client, 'zscan');
    this.zscore = promisify(this.client, 'zscore');
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

  removeSortedSetValues(key, values) {
    return this.zrem(key, ...values);
  }

  getSortedSetValues(key) {
    return this.zscan(key, 0).then(v => v.pop());
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
