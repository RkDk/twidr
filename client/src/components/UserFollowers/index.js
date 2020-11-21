import React from 'react';
import ApiService from '../../services/ApiService';

import styles from './styles.module.scss';
import InfiniteList from '../InfiniteList';

import UserContext from '../../context/UserContext';
import InlineUserCard from '../InlineUserCard';

class UserFollowers extends React.Component {
  constructor(props) {
    super(props);
    this.getFollowers = this.getFollowers.bind(this);
  }
  getFollowers(limit, offset) {
    return ApiService.getUserFollowers(this.props.userId, limit, offset);
  }
  render() {
    return (
      <div className={styles.container}>
        <InfiniteList 
          containerClassname={styles.followerList} 
          loadItems={this.getFollowers} 
          elementHeight={85}
          renderItem={item=>{
            return (<InlineUserCard user={item.follower}/>);
          }}
        />
      </div>
    );
  }
}

UserFollowers.contextType = UserContext;

export default UserFollowers;
