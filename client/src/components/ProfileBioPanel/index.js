import React from 'react';
import styles from './styles.module.css';

function ProfileBioPanel(props) {
  const { profileImage, fullName, userHandle, bio } = props.user;
  return (
    <div>
      <img className={styles.profileImage} src={profileImage}/>
      <div className={styles.fullName}>{fullName}</div>
      <div className={styles.userHandle}>@{userHandle}</div>
      <div className={styles.userBio}>{bio}</div>
    </div>
  );
}

export default ProfileBioPanel;
