const debug = require('debug')('twidr:post-cache');
const CacheService = require('./CacheService');
const Post = require('../models/Post');

class PostCacheService {
  async getPosts(ids) {
    const posts = await CacheService.getJsonMultiple(ids.map(id => `post:${id}`));
    const cacheMisses = posts.map((post, index) => post ? null : ids[index]).filter(v => !!v);
    debug(`Querying for ${ids.length} posts with ${cacheMisses.length} cache-misses`);
    const loadedPosts = !cacheMisses.length ? []
      : await Post
        .query()
        .joinRaw(`JOIN unnest('{${cacheMisses.join(',')}}'::int[]) WITH ORDINALITY t(id, ord) USING (id)`)
        .orderByRaw('t.ord')
        .modify('defaultSelectsWithoutUser');
    for (const post of loadedPosts) {
      debug('Filling post cache-miss for ', post.id);
      await CacheService.setJson(`post:${post.id}`, post);
    }
    return posts.map(post => {
      return post || loadedPosts.shift();
    });
  }
};

module.exports = new PostCacheService();
