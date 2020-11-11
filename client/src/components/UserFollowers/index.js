import React from 'react';
import ApiService from '../../services/ApiService';
import Post from '../Post';

import Constants from '../../constants';
import Utils from '../../utils';

import styles from './styles.module.scss';
import InfiniteList from '../InfiniteList';

import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

import PostEditor from '../PostEditor';
import UserContext from '../../context/UserContext';

class UserFollowers extends React.Component {
  constructor( props ) {
    super( props );
    this.getFollowers = this.getFollowers.bind( this );
  }
  getFollowers( limit, offset ) {
    return ApiService.getUserFollowers( this.props.userId,limit,offset );
  }
  render() {
    return (
      <div className={styles.container}>
        <InfiniteList 
          containerClassname={styles.postList} 
          loadItems={this.getFollowers} 
          renderItem={item=>{
            return ( <>
              {item.follower.name}
            </> );
          }}
        />
      </div>
    );
  }
};

UserFollowers.contextType = UserContext;

export default UserFollowers;
