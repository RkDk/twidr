import React, {useContext} from 'react';
import styles from './styles.module.scss';
import UserContext from '../../context/UserContext';
import Button from 'react-bootstrap/Button';

function FollowActionButton(props) {
  const {user} = props;
  const userContext = useContext(UserContext);
  console.log(userContext.user);
  const {followingIds = []} = userContext?.user;
  
  if(followingIds.includes(user.id)) {
    return <Button variant="secondary">Unfollow</Button>;
  }
  return <Button variant="primary">Follow</Button>;
}

function InlineUserCard(props) {
  const {user} = props;
  return (
    <div className={styles.container}>
      <div>{ user.profileImage && <img className={styles.profileImage} src={user.profileImage.url}/> }</div>
      <div>{ user.name }</div>
      <FollowActionButton user={user}/>
    </div>
  );
}

export default InlineUserCard;
