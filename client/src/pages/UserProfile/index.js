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

class UserProfile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
    this.showMain = this.showMain.bind(this);
    this.showFollowers = this.showFollowers.bind(this);
    this.showFollowing = this.showFollowing.bind(this);
  }

  async componentDidMount() {
    const user = await ApiService.getUser(this.props.match.params.userId);
    this.setState({
      user 
    });
  }

  goToSubPath(subPath = '') {
    this.props.history.replace({pathname: `/user/${this.state.user.id}${subPath}`});
  }

  showMain(e) {
    e.preventDefault();
    this.goToSubPath();
  }

  showFollowers(e) {
    e.preventDefault();
    this.goToSubPath('/followers');
  }

  showFollowing(e) {
    e.preventDefault();
    this.goToSubPath('/following');
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
    if(!user) {
      return (<></>);
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
              <div className={Utils.concatStyles(styles.subNavbarItem, !subPath && styles.subNavbarItemSelected)} onClick={this.showMain}>Posts</div>
              <div className={Utils.concatStyles(styles.subNavbarItem, subPath === 'followers' && styles.subNavbarItemSelected)} onClick={this.showFollowers}>Followers</div>
              <div className={Utils.concatStyles(styles.subNavbarItem, subPath === 'following' && styles.subNavbarItemSelected)} onClick={this.showFollowing}>Following</div>
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
