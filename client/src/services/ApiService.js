import axios from 'axios';
import Utils from '../utils';

function parseNewsfeed( data ) {
    const { users, posts } = data;
    return posts.map( post => {
        return {
            user: users.find(({id}) => id === post.userId),
            post
        };
    } );
}

class ApiService {
    static async getNewsfeedPosts() {
        const options = Utils.axiosOptions( '/newsfeed', {
            method: 'GET'
        } );
        return axios( options ).then(({data})=> parseNewsfeed(data));
    }
    static getCurrentUser() {
        const options = Utils.axiosOptions( '/user', {
            method: 'GET'
        } );
        return axios( options ).then(({data})=>data);
    };

}

export default ApiService;