import axios from 'axios';
import Utils from '../utils';

function parseUserfeed(data) {
  const {users, posts} = data;
  let nextOffset;
  const items = posts.map(post => {
    nextOffset = post.createdAt;
    return {
      user: users.find(({id}) => id === post.userId),
      post
    };
  });
  return {nextOffset, items};
}

class ApiService {
  static createPost(content) {
    const options = Utils.axiosOptions('/posts', {
      method: 'POST',
      data: {
        content
      }
    });
    return axios(options).then(({data}) => data);
  }
  static getNewsfeedPosts(limit, offset) {
    const options = Utils.axiosOptions(`/newsfeed?limit=${limit}${offset ? '&offset='.concat(offset) : ''}`, {
      method: 'GET'
    });
    return axios(options).then(({data})=> parseUserfeed(data));
  }
  static getUserfeedPosts(userId, limit, offset) {
    const options = Utils.axiosOptions(`/posts?userId=${userId}&limit=${limit}${offset ? '&offset='.concat(offset) : ''}`, {
      method: 'GET'
    });
    return axios(options).then(({data})=> parseUserfeed(data));
  }
  static getUser(userId) {
    const options = Utils.axiosOptions(`/users/${userId}`, {
      method: 'GET'
    });
    return axios(options).then(({data})=>data);
  }
  static getUsersFollowing(userId, limit, offset) {
    const options = Utils.axiosOptions(`/users/${userId}/following?limit=${limit}${offset ? '&offset='.concat(offset) : ''}`, {
      method: 'GET'
    });
    return axios(options).then(({data})=>data);
  }
  static getUserFollowers(userId, limit, offset) {
    const options = Utils.axiosOptions(`/users/${userId}/followers?limit=${limit}${offset ? '&offset='.concat(offset) : ''}`, {
      method: 'GET'
    });
    return axios(options).then(({data})=>data);
  }
  static followUser(userId) {
    const options = Utils.axiosOptions(`/users/${userId}/follow`, {
      method: 'POST',
      data: {}
    });
    return axios(options);
  }
  static unfollowUser(userId) {
    const options = Utils.axiosOptions(`/users/${userId}/unfollow`, {
      method: 'POST',
      data: {}
    });
    return axios(options);
  }
  static getCurrentUser() {
    const options = Utils.axiosOptions('/user', {
      method: 'GET'
    });
    return axios(options).then(({data})=>data);
  }

}

export default ApiService;