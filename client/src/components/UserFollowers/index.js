import React from 'react';
import ApiService from '../../services/ApiService';
import Post from '../Post';

import Constants from '../../constants';
import Utils from '../../utils';

import styles from './styles.module.scss';
import Spinner from 'react-bootstrap/Spinner';

import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

import PostEditor from '../PostEditor';
import UserContext from '../../context/UserContext';

class UserFollowers extends React.Component {
  constructor(props) {
    super(props);
    
    this.ref = React.createRef();
    this.dateOffset = null;
    this.renderedFollowerCount = 0;
    this.nextApiFetch = 0;

    this.state = {
      followers: [],
      showSpinner: false,
      fetchedEverything: false,
    };

    this.handleScroll = this.handleScroll.bind(this);
  }
  attachFollowerRefs( followers ) {
    return followers.map( ({createdAt, follower}) => {
      return {
        follower, 
        createdAt,
        ref: follower.ref || React.createRef( null )
      };
    } );
  }
  getFollowers( limit, offset ) {
    return ApiService.getUserFollowers(this.props.userId,limit,offset);
  }
  loadFollowers( limit ) {
    this.getFollowers(limit, this.dateOffset)
      .then((newFollowers) => {
        const { followers: curFollowers } = this.state;
        curFollowers.push( ...newFollowers.sort(( b, a ) => +new Date(a.createdAt) - +new Date(b.createdAt)) );
        this.setState( {
          followers: this.attachFollowerRefs( curFollowers ),
          showSpinner: false,
          fetchedEverything: newFollowers.length === 0
        } );
        if( newFollowers.length ) {
          this.dateOffset = newFollowers[newFollowers.length-1].createdAt;
        }
        this.nextApiFetch = Date.now() + Constants.MAX_DELAY_BETWEEN_USERFEED_FETCH;
      });
  }
  handleScroll(e) {
    if( this.state.showSpinner || this.state.fetchedEverything ) {
      return;
    } 
    if( Utils.getDocumentScrollPercentage() > .9 ) {
      this.setState({
        showSpinner: true,
        fetchedEverything: false
      });
      setTimeout( () => {
        this.loadFollowers( Constants.USERFEED_FETCH_COUNT );
      }, Math.max( this.nextApiFetch - Date.now(), Constants.MIN_DELAY_BETWEEN_USERFEED_FETCH ) );
    }
  }
  componentDidMount() {
    const thisY = Utils.getElementTop(this.ref?.current);
    const initialElementHeight = ( Utils.getViewportHeight() - thisY );
    const initialLimit = Math.ceil( initialElementHeight / 150 ); 
    this.loadFollowers(initialLimit);

    window.addEventListener('scroll', this.handleScroll);
  }
  renderFollowers() {
    const followerList = this.state.followers.map((postData, index) => {
      const { follower, name, ref } = postData;
      const delay = Math.max(0,index-(this.renderedFollowerCount-1)) * 50;
      const timeout = 500 + delay;
      const transitionDelay = `${delay}ms`;
      return (
        <CSSTransition in={true} timeout={timeout} key={follower.id} 
        nodeRef={ref}
        classNames={{
          enter: styles.postEntering,
          enterActive: styles.postActive
        }}>
          <div ref={ref} style={{ transitionDelay }}>
            {follower.name}
          </div>
        </CSSTransition>
      );
    });
    this.renderedFollowerCount = this.state.followers.length;
    return followerList;
  }
  render() {
    return (
      <div ref={this.ref} className={styles.container}>
        <TransitionGroup className={styles.postList}>
          {this.renderFollowers()}
        </TransitionGroup>
        {this.state.showSpinner || this.state.fetchedEverything? 
            (
              <div className={styles.footer}>
                {this.state.showSpinner? <Spinner animation="border" /> : null}
                {this.state.fetchedEverything? <b>{"That's all!"}</b> : null}
              </div> 
            ) : null
        }
      </div>
    );
  }
};

UserFollowers.contextType = UserContext;

export default UserFollowers;
