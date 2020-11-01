import React from 'react';
import styles from './styles.module.css';
import Utils from '../../utils';
import { Heart, Share, ChatRightText } from 'react-bootstrap-icons';

function _Post() {
  function Post(props,ref) {
    const { user, post, style } = props;
    const { likes, shares, replies } = post.metrics;
    return (
      <div ref={ref} className={styles.container} style={style}>
        <div className={styles.headerRow}>
          <img className={styles.userImageDisplay} src={user.profileImage.url}/>
          <div className={styles.nameDisplay}>{user.name}<span className={styles.userHandle}> @{user.handle}</span></div>
          <div className={styles.timeDisplay}>{Utils.formatDateTime(post.createdAt)}</div>
        </div>
        <div className={styles.contentRow}>{post.content.substring(0,100)}{post.content.length>100 && <>...</> }</div>
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
  return React.forwardRef(Post);
}

const Post = _Post();
export default Post;
