import React, {useContext} from 'react';
import styles from './styles.module.scss';
import UserContext from '../../context/UserContext';
import Button from 'react-bootstrap/Button';
import ApiService from '../../services/ApiService';

function FollowActionButton(props) {
  const {user} = props;
  const userContext = useContext(UserContext);
  const {followingIds = []} = userContext?.user;

  const onHandleFollow = async () => {
    await ApiService.followUser(user.id);
    userContext?.updateUser({followingIds: [...followingIds, user.id]});
  };

  const onHandleUnfollow = async () => {
    await ApiService.unfollowUser(user.id);
    userContext?.updateUser({followingIds: followingIds.filter(id => id !== user.id)});
  };
  
  if(followingIds.includes(user.id)) {
    return <Button variant="secondary" onClick={onHandleUnfollow}>Unfollow</Button>;
  }
  return <Button variant="primary" onClick={onHandleFollow}>Follow</Button>;
}

function InlineUserCard(props) {
  const {user} = props;
  if(!user) {
    return null;
  }
  return (
    <div className={styles.container}>
      <div>{ user.profileImage && <img className={styles.profileImage} src={user.profileImage.url}/> }</div>
      <div>{ user.name }</div>
      <FollowActionButton user={user}/>
    </div>
  );
}

export default InlineUserCard;
