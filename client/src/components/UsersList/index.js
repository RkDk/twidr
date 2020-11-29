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
    this.setType(this.props.type);
  }
  getFollowers(limit, offset) {
    return ApiService.getUserFollowers(this.props.userId, limit, offset);
  }
  getFollowing(limit, offset) {
    return ApiService.getUsersFollowing(this.props.userId, limit, offset);
  }
  setType(type) {
    this.listKey = Date.now();
    this.type = type;
  }
  renderContent() {
    let getUsersList;
    if(this.type !== this.props.type) {
      this.setType(this.props.type);
    }
    switch(this.type) {
        case USER_LIST_TYPE_FOLLOWERS:
          getUsersList = this.getFollowers.bind(this);
          break;
        case USER_LIST_TYPE_FOLLOWING:
          getUsersList = this.getFollowing.bind(this);
          break;
        default:
          return null;
    }
    return (
      <InfiniteList 
        key={this.listKey}
        containerClassname={styles.userList} 
        loadItems={getUsersList} 
        elementHeight={85}
        renderItem={item=>{
          return (<InlineUserCard user={item}/>);
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
