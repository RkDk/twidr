import React, { useContext } from 'react';
import UserContext from '../../context/UserContext';
import styles from './styles.module.css';

function ProfileBioPanel(props) {
  const {user} = useContext(UserContext);
  return user && (
    <div>
      { user.profileImage && <img className={styles.profileImage} src={user.profileImage.url}/> }
      <div className={styles.fullName}>{user.name}</div>
      <div className={styles.userHandle}>@{user.handle}</div>
      { user.bio && <div className={styles.userBio}>{user.bio}</div> }
    </div>
  );
}

export default ProfileBioPanel;
