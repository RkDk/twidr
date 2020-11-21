import axios from 'axios';
import Utils from '../utils';

function parseUserfeed(data) {
  const {users, posts} = data;
  return posts.map(post => {
    return {
      user: users.find(({id}) => id === post.userId),
      post
    };
  });
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
  static async getNewsfeedPosts(limit, offset) {
    const options = Utils.axiosOptions(`/newsfeed?limit=${limit}${offset ? '&offset='.concat(offset) : ''}`, {
      method: 'GET'
    });
    return axios(options).then(({data})=> parseUserfeed(data));
  }
  static async getUserfeedPosts(userId, limit, offset) {
    const options = Utils.axiosOptions(`/posts?userId=${userId}&limit=${limit}${offset ? '&offset='.concat(offset) : ''}`, {
      method: 'GET'
    });
    return axios(options).then(({data})=> parseUserfeed(data));
  }
  static async getUser(userId) {
    const options = Utils.axiosOptions(`/users/${userId}`, {
      method: 'GET'
    });
    return axios(options).then(({data})=>data);
  }
  static async getUserFollowers(userId, limit, offset) {
    const options = Utils.axiosOptions(`/users/${userId}/followers?limit=${limit}${offset ? '&offset='.concat(offset) : ''}`, {
      method: 'GET'
    });
    return axios(options).then(({data})=>data);
  }
  static getCurrentUser() {
    const options = Utils.axiosOptions('/user', {
      method: 'GET'
    });
    return axios(options).then(({data})=>data);
  }

}

export default ApiService;