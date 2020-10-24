import React, {useState, useEffect} from 'react';
import ApiService from '../../Services/ApiService';
import Post from '../Post';
import styles from './styles.module.css';

function Newsfeed() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    ApiService.getNewsfeedPosts()
      .then( posts => {
        setPosts(posts.sort(( b, a ) => a.post.timestamp - b.post.timestamp));
      });
  }, []);
  return (
    <div className={styles.container}>
      {posts.map(({post,author}, index) => {
        return (
          <Post key={index} post={post} author={author}/>
        );
      })}
    </div>
  );
}

export default Newsfeed;
