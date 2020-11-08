import React, { useContext } from 'react';
import UserContext from '../../context/UserContext';
import Utils from '../../utils';
import styles from './styles.module.scss';


function ProfileBioPanel(props) {
  const {user} = useContext(UserContext);
  const classSuffix = props.isBanner? 'Banner' : 'Panel';
  return user && (
    <div className={Utils.suffixStyle(styles,'container',classSuffix)}>
      { user.profileImage && <img className={Utils.suffixStyle(styles,'profileImage',classSuffix)} src={user.profileImage.url}/> }
      <div className={Utils.suffixStyle(styles,'infoSection',classSuffix)}>
        <h1>{user.name}</h1>
        <div className={styles.userHandle}>@{user.handle}</div>
        { user.bio && <div className={Utils.suffixStyle(styles,'userBio',classSuffix)}>{user.bio}</div> }
      </div>
    </div>
  );
}

export default ProfileBioPanel;
