import React, {useContext} from 'react';
import {useHistory} from 'react-router-dom';
import UserContext from '../../context/UserContext';
import Utils from '../../utils';
import styles from './styles.module.scss';


function ProfileBioPanel(props) {
  const {user} = useContext(UserContext);
  const targetUser = props.user || user;
  const history = useHistory();
  const classSuffix = props.isBanner ? 'Banner' : 'Panel';
  return user && (
    <div className={Utils.suffixStyle(styles, 'container', classSuffix)}>
      { targetUser.profileImage && <img className={Utils.suffixStyle(styles, 'profileImage', classSuffix)} src={targetUser.profileImage.url}/> }
      <div className={Utils.suffixStyle(styles, 'infoSection', classSuffix)}>
        <span className={styles.link} onClick={()=>Utils.navigateTo(history, `/user/${targetUser.id}`)}>
          <h1>{targetUser.name}</h1>
          <div className={styles.userHandle}>@{targetUser.handle}</div>
        </span>
        { targetUser.bio && <div className={Utils.suffixStyle(styles, 'userBio', classSuffix)}>{targetUser.bio}</div> }
      </div>
    </div>
  );
}

export default ProfileBioPanel;
