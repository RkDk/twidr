import React, { useContext } from 'react';
import UserContext from '../../context/UserContext';
import styles from './styles.module.scss';

function ProfileBioBanner(props) {
  const { user } = props;
  return user && (
    <div className={styles.container}>
      <div>
        { user.profileImage && <img className={styles.profileImage} src={user.profileImage.url}/> }
      </div>
      <div className={styles.infoSection}>
        <div className={styles.fullName}>{user.name}</div>
        <div className={styles.userHandle}>@{user.handle}</div>
        { user.bio && <div className={styles.userBio}>{user.bio}</div> }
      </div>
    </div>
  );
}

export default ProfileBioBanner;