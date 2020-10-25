import React from 'react';
import styles from './styles.module.css';
import Utils from '../../utils';
import { Heart, Share, ChatRightText } from 'react-bootstrap-icons';

function Post(props) {
  const { user, post } = props;
  const { likes, shares, replies } = post.metrics;
  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <img className={styles.userImageDisplay} src={user.profileImage.url}/>
        <div className={styles.nameDisplay}>{user.name}<span className={styles.userHandle}> @{user.handle}</span></div>
        <div className={styles.timeDisplay}>{Utils.formatDateTime(post.createdAt)}</div>
      </div>
      <div className={styles.contentRow}>{post.content}</div>
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

export default Post;
