import React from 'react';
import {withRouter} from 'react-router-dom';
import styles from './styles.module.scss';
import Utils from '../../utils';
import {Heart, Share, ChatRightText} from 'react-bootstrap-icons';

function _Post() {
  class Post extends React.Component {
    constructor(props) {
      super(props);
      this.navigatePath = null;
      this.ref = this.props.forwardedRef || React.createRef();
      this.navigateToPath = this.navigateToPath.bind(this);
    }
    componentDidMount() {
      if(this.ref?.current) {
        this.ref.current.addEventListener('mouseover', (ev) => {
          this.navigatePath = ev?.target?.getAttribute('data-path');
        });
      }
    }

    navigateToPath() {
      const {user, post} = this.props;
      Utils.navigateTo(this.props.history, this.navigatePath || `/user/${user.id}/post/${post.id}`);
    }
    
    render() {
      const {user, post, style} = this.props;
      const {likes, shares, replies} = post.metrics;
      return (
        <div ref={this.ref} className={styles.container} style={style} onClick={this.navigateToPath}>
          <div className={styles.headerRow}>
            <img className={Utils.concatStyles(styles.userImageDisplay, styles.pointerOnHover)}  data-path={`/user/${user.id}`}  src={user.profileImage.url}/>
            <div className={Utils.concatStyles(styles.nameDisplay, styles.pointerOnHover)} data-path={`/user/${user.id}`}>
              <span className={styles.pointerOnHover} data-path={`/user/${user.id}`}>{user.name}</span>
              <span className={Utils.concatStyles(styles.userHandle, styles.pointerOnHover)} data-path={`/user/${user.id}`}> @{user.handle}</span>
            </div>
            <div className={styles.timeDisplay}>{Utils.formatDateTime(post.createdAt)}</div>
          </div>
          <div className={styles.contentRow}>{post.content.substring(0, 180)}{post.content.length > 180 && <>...</> }</div>
          <div className={styles.footerRow}>
            <span className={styles.likesDisplay}>
              <Heart className={styles.footerIcon}/><span>{likes}</span>
            </span>
            <span className={styles.sharesDisplay}>
              <Share className={styles.footerIcon}/><span>{shares}</span>
            </span>
            <span className={styles.repliesDisplay}>
              <ChatRightText className={styles.footerIcon}/><span>{replies}</span>
            </span>
          </div>
        </div>
      );
    }
  }
  return React.forwardRef((props, ref) => <Post {...props} forwardedRef={ref}/>);
}

const Post = _Post();
export default withRouter(Post);
