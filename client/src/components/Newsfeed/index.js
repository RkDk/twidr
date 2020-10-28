import React from 'react';
import ApiService from '../../services/ApiService';
import Post from '../Post';

import Constants from '../../constants';
import Utils from '../../utils';

import styles from './styles.module.css';
import Spinner from 'react-bootstrap/Spinner';


class Newsfeed extends React.Component {
  constructor(props) {
    super(props);
    this.dateOffset = null;
    this.ref = React.createRef();
    this.state = {
      posts: [],
      renderSpinner: false,
      gotEverything: false
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
          renderSpinner: false,
          gotEverything: newPosts.length === 0
        } );
        if( newPosts.length ) {
          this.dateOffset = newPosts[newPosts.length-1].post.createdAt;
        }
      });
  }
  handleScroll(e) {
    if( this.state.renderSpinner || this.state.gotEverything ) {
      return;
    } 
    if( Utils.getDocumentScrollPercentage() > .9 ) {
      this.setState({
        renderSpinner: true,
        gotEverything: false
      });
      setTimeout( () => {
        this.loadPosts( 5 );
      }, 400 );
    }
  }
  componentDidMount() {
    const thisY = Utils.getElementTop(this.ref?.current);
    const initialElementHeight = ( Constants.ViewportHeight - thisY );
    const initialLimit = Math.ceil( initialElementHeight / 150 ); 
    this.loadPosts(initialLimit);

    window.addEventListener('scroll', this.handleScroll);
  }
  render() {
    return (
      <div ref={this.ref} className={styles.container}>
        {this.state.posts.map(({post,user}, index) => {
          return (
            <Post key={index} post={post} user={user}/>
          );
        })}
        {this.state.renderSpinner || this.state.gotEverything? 
          (
            <div className={styles.footer}>
              {this.state.renderSpinner ? <Spinner animation="border" /> : null}
              {this.state.gotEverything ? <b>Thats all!</b> : null}
            </div> 
          ) : null}
      </div>
    );
  }
};


export default Newsfeed;
