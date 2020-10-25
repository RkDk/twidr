import React, {useState, useEffect} from 'react';
import ApiService from '../../services/ApiService';
import Post from '../Post';
import styles from './styles.module.css';

function Newsfeed() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    ApiService.getNewsfeedPosts()
      .then((posts) => {
        setPosts(posts.sort(( b, a ) => +new Date(a.post.createdAt) - +new Date(b.post.createdAt)));
      });
  }, []);
  return (
    <div className={styles.container}>
      {posts.map(({post,user}, index) => {
        return (
          <Post key={index} post={post} user={user}/>
        );
      })}
    </div>
  );
}

export default Newsfeed;
