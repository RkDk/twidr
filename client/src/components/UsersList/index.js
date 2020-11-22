import React from 'react';
import ApiService from '../../services/ApiService';

import styles from './styles.module.scss';
import InfiniteList from '../InfiniteList';

import UserContext from '../../context/UserContext';
import InlineUserCard from '../InlineUserCard';

const USER_LIST_TYPE_FOLLOWERS = 1;
const USER_LIST_TYPE_FOLLOWING = 2;

class UsersList extends React.Component {
  constructor(props) {
    super(props);
    this.getFollowers = this.getFollowers.bind(this);
  }
  getFollowers(limit, offset) {
    return ApiService.getUserFollowers(this.props.userId, limit, offset);
  }
  getFollowing(limit, offset) {
    return ApiService.getUsersFollowing(this.props.userId, limit, offset);
  }
  renderContent() {
    let getUsersList, itemKey;
    switch(this.props.type) {
        case USER_LIST_TYPE_FOLLOWERS:
          getUsersList = this.getFollowers.bind(this);
          itemKey = 'follower';
          break;
        case USER_LIST_TYPE_FOLLOWING:
          getUsersList = this.getFollowing.bind(this);
          itemKey = 'followee';
          break;
        default:
          return null;
    }
    return (
      <InfiniteList 
        key={Date.now()}
        containerClassname={styles.userList} 
        loadItems={getUsersList} 
        elementHeight={85}
        renderItem={item=>{
          return (<InlineUserCard user={item[itemKey]}/>);
        }}
      />
    );
  }
  render() {
    return (
      <div className={styles.container}>
        {this.renderContent()}
      </div>
    );
  }
}

UsersList.contextType = UserContext;

export {
  USER_LIST_TYPE_FOLLOWERS,
  USER_LIST_TYPE_FOLLOWING
};

export default UsersList;
