const debug = require('debug')('twidr:post-cache');
const CacheService = require('./CacheService');
const Post = require('../models/Post');
const PostMetric = require('../models/PostMetric');
const _ = require('lodash');

function getPostKey(id) {
  return `post:${id}`;
}

function getPostMetricsKey(id) {
  return `post:${id}:metrics`;
}

class PostCacheService {
  async getPostMetrics(id) {
    const key = getPostMetricsKey(id);
    if (!await CacheService.keyExists(key)) {
      const metrics = await PostMetric
        .query()
        .where({
          postId: id
        })
        .modify('defaultSelects')
        .first();
      await CacheService.setJson(key, metrics);
      return metrics;
    }
    return await CacheService.getJson(key);
  }

  async setPostMetrics(postId, metrics) {
    const key = getPostMetricsKey(postId);
    await CacheService.setJson(key, metrics);
  }

  async setPost(post) {
    const {id, metrics} = post;
    const key = getPostKey(id);
    if (metrics) {
      await this.setPostMetrics(id, metrics);
    }
    await CacheService.setJson(key, _.pick(post, Object.keys(post).filter(v => v !== 'metrics')));
  }

  async getPost(id) {
    return (await this.getPosts([id])).pop();
  }

  async getPosts(ids) {
    const posts = await CacheService.getJsonMultiple(ids.map(id => getPostKey(id)));
    const cacheMisses = posts.map((post, index) => post ? null : ids[index]).filter(v => !!v);
    debug(`Querying for ${ids.length} posts with ${cacheMisses.length} cache-misses`);
    const loadedPosts = !cacheMisses.length ? []
      : await Post
        .query()
        .joinRaw(`JOIN unnest('{${cacheMisses.join(',')}}'::int[]) WITH ORDINALITY t(id, ord) USING (id)`)
        .orderByRaw('t.ord')
        .modify('defaultSelectsWithoutUserAndMetrics');
    for (const post of loadedPosts) {
      debug('Filling post cache-miss for ', post.id);
      await CacheService.setJson(getPostKey(post.id), post);
    }

    return Promise.all(
      posts.map(post => {
        const result = post || loadedPosts.shift();
        return Promise.resolve()
          .then(async () => await this.getPostMetrics(result.id))
          .then(metrics => {
            return Object.assign({metrics}, result);
          });
      })
    );
  }
};

module.exports = new PostCacheService();
