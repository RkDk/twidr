import React from 'react';
import ApiService from '../../services/ApiService';

import Navbar from '../../components/Navbar';
import TrendingPanel from '../../components/TrendingPanel';
import RecommendedPanel from '../../components/RecommendedPanel';

import styles from './styles.module.scss';
import UserContext from '../../context/UserContext';
import ProfileBioPanel from '../../components/ProfileBioPanel';
import Utils from '../../utils';
import SideMenuPanel from '../../components/SideMenuPanel';
import Userfeed from '../../components/Userfeed';
import UsersList, {USER_LIST_TYPE_FOLLOWING, USER_LIST_TYPE_FOLLOWERS} from '../../components/UsersList';

function SubNavbarButton(props) {
  const {curSubPath = null, subPath = null, label, onNavigate} = props;
  const pathSelected = ((!curSubPath && !subPath) || curSubPath === subPath);
  const onClickWrapper = (e) => {
    e.preventDefault();
    onNavigate(`/${subPath || ''}`);
  };
  return (
    <div className={Utils.concatStyles(styles.subNavbarItem, pathSelected && styles.subNavbarItemSelected)} onClick={onClickWrapper}>
      {label}
    </div>
  );
}

class UserProfile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
    this.goToSubPath = this.goToSubPath.bind(this);
  }

  async fetchUserId(userId) {
    const user = await ApiService.getUser(userId);
    this.setState({
      user 
    });
  }

  goToSubPath(subPath = '') {
    this.props.history.replace({pathname: `/user/${this.state.user.id}${subPath}`});
  }

  getCurrentSubPath() {
    const {location: {pathname = ''}} = this.props;
    const path = pathname.split('/');
    return path?.[3];
  }

  renderContent(subPath) {
    const {user} = this.state;
    switch(subPath) {
        case 'followers': {
          return <UsersList type={USER_LIST_TYPE_FOLLOWERS} userId={user.id}/>;
        }
        case 'following': {
          return <UsersList type={USER_LIST_TYPE_FOLLOWING} userId={user.id}/>;
        }
        default: {
          return <Userfeed userId={user.id}/>;
        }
    }
  }

  render() {
    const {user} = this.state;
    const {userId} = this.props?.match?.params;
    if(userId && +userId !== +user?.id) {
      this.fetchUserId(userId);
      return null;
    }
    if(!user) {
      return null;
    }
    const subPath = this.getCurrentSubPath();
    return (
      <div className={styles.container}>
        <Navbar/>
        <div className={styles.mainThreeColumn}>
          <div className={Utils.concatStyles(styles.mainLeftCol, styles.sideMenu, styles.hideOnSmallScreen)}>
            <SideMenuPanel includeDashboardLink={true}/>
          </div>
          <div className={styles.mainMidCol}>
            <ProfileBioPanel isBanner={true} user={user}/>
            <div className={styles.subNavbar}>
              <SubNavbarButton curSubPath={subPath} label='Posts' onNavigate={this.goToSubPath}/>
              <SubNavbarButton curSubPath={subPath} subPath='followers' label='Followers' onNavigate={this.goToSubPath}/>
              <SubNavbarButton curSubPath={subPath} subPath='following' label='Following' onNavigate={this.goToSubPath}/>
            </div>
            {this.renderContent(subPath)}
          </div>
          <div className={Utils.concatStyles(styles.mainRightCol, styles.hideOnSmallScreen)}>
            <TrendingPanel/>
            <RecommendedPanel/>
          </div>
        </div>
      </div>
    );
  }
}

UserProfile.contextType = UserContext;

export default UserProfile;
