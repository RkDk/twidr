import React from 'react';
import ApiService from '../../services/ApiService';
import Post from '../Post';

import Constants from '../../constants';
import Utils from '../../utils';

import styles from './styles.module.css';
import Spinner from 'react-bootstrap/Spinner';

import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

class Newsfeed extends React.Component {
  constructor(props) {
    super(props);
    
    this.ref = React.createRef();
    this.dateOffset = null;
    this.renderedPostCount = 0;
    this.nextApiFetch = 0;

    this.state = {
      posts: [],
      showSpinner: false,
      fetchedEverything: false
    };

    this.handleScroll = this.handleScroll.bind(this);
  }
  loadPosts( limit ) {
    ApiService.getNewsfeedPosts(limit, this.dateOffset)
      .then((newPosts) => {
        const { posts: curPosts } = this.state;
        curPosts.push( ...newPosts.sort(( b, a ) => +new Date(a.post.createdAt) - +new Date(b.post.createdAt)));
        this.setState( {
          posts: curPosts,
          showSpinner: false,
          fetchedEverything: newPosts.length === 0
        } );
        if( newPosts.length ) {
          this.dateOffset = newPosts[newPosts.length-1].post.createdAt;
        }
        this.nextApiFetch = Date.now() + Constants.MAX_DELAY_BETWEEN_NEWSFEED_FETCH;
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
        this.loadPosts( Constants.NEWSFEED_FETCH_COUNT );
      }, Math.max( this.nextApiFetch - Date.now(), Constants.MIN_DELAY_BETWEEN_NEWSFEED_FETCH ) );
    }
  }
  componentDidMount() {
    const thisY = Utils.getElementTop(this.ref?.current);
    const initialElementHeight = ( Utils.getViewportHeight() - thisY );
    const initialLimit = Math.ceil( initialElementHeight / 150 ); 
    this.loadPosts(initialLimit);

    window.addEventListener('scroll', this.handleScroll);
  }
  renderPosts() {
    const postList = this.state.posts.map(({post,user}, index) => {
      const delay = Math.max(0,index-(this.renderedPostCount-1)) * 50;
      const timeout = 500 + delay;
      const transitionDelay = `${delay}ms`;
      return (
        <CSSTransition in={true} timeout={timeout} key={index} 
        classNames={{
          enter: styles.postEntering,
          enterActive: styles.postActive
        }}>
          <Post post={post} user={user} style={{ transitionDelay }} />
        </CSSTransition>
      );
    });
    this.renderedPostCount = this.state.posts.length;
    return postList;
  }
  render() {
    return (
      <div ref={this.ref} className={styles.container}>
        <TransitionGroup className={styles.postList}>
          {this.renderPosts()}
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


export default Newsfeed;
