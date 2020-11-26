import React from 'react';
import ApiService from '../../services/ApiService';
import Post from '../Post';

import styles from './styles.module.scss';

import PostEditor from '../PostEditor';
import InfiniteList from '../InfiniteList';
import UserContext from '../../context/UserContext';

class Userfeed extends React.Component {
  constructor(props) {
    super(props);
    
    this.infiniteListRef = React.createRef();
    this.getUserfeedPosts = this.getUserfeedPosts.bind(this);
    this.onUserCreatedPost = this.onUserCreatedPost.bind(this);
  }
  getUserfeedPosts(limit, offset) {
    return ApiService.getUserfeedPosts(this.props.userId, limit, offset);
  }
  getNewsfeedPosts(limit, offset) {
    return ApiService.getNewsfeedPosts(limit, offset);
  }
  onUserCreatedPost(post) {
    this.infiniteListRef.current.addItem(post, true, true);
  }
  render() {
    return (
      <div className={styles.container}>
        { !this.props.userId || this.props.userId === this.context.user.id ? <PostEditor onUserCreatedPost={this.onUserCreatedPost}/> : <div></div> }
        <InfiniteList 
          ref={this.infiniteListRef}
          containerClassname={styles.postList} 
          loadItems={this.props.userId ? this.getUserfeedPosts : this.getNewsfeedPosts} 
          elementHeight={150}
          itemIdKey={'post.id'}
          itemDateKey={'post.createdAt'}
          renderItem={item=>{
            const {post, user} = item;
            return (<Post user={user} post={post}/>);
          }}
        />
      </div>
      
    );
  }
}

Userfeed.contextType = UserContext;

export default Userfeed;
