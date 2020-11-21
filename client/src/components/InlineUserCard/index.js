import React from 'react';
import styles from './styles.module.scss';


function InlineUserCard(props) {
  const {user} = props;
  return (
    <div className={styles.container}>
      <div>{ user.profileImage && <img className={styles.profileImage} src={user.profileImage.url}/> }</div>
      <div>{ user.name }</div>
      <div>Follow</div>
    </div>
  );
}

export default InlineUserCard;
