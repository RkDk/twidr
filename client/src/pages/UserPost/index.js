import React from 'react';
import ApiService from '../../services/ApiService';

import Navbar from '../../components/Navbar';
import TrendingPanel from '../../components/TrendingPanel';
import RecommendedPanel from '../../components/RecommendedPanel';

import styles from './styles.module.scss';
import UserContext from '../../context/UserContext';
import Utils from '../../utils';
import SideMenuPanel from '../../components/SideMenuPanel';
import Post from '../../components/Post';

/*
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
*/

class UserPost extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      user: null,
      post: null
    };
    this.goToSubPath = this.goToSubPath.bind(this);
  }

  async fetchUserPost(userId, postId) {
    const {user, post} = await ApiService.getUserPost(postId);
    this.setState({
      loaded: true,
      user,
      post,
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
    const {user, post} = this.state;
    switch(subPath) {
        default: {
          return <Post user={user} post={post}/>;
        }
    }
  }

  render() {
    const {loaded, user, post} = this.state;
    const {userId, postId} = this.props?.match?.params;
    if(!loaded) {
      this.fetchUserPost(userId, postId);
      return null;
    }
    if(!user || !post) {
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

UserPost.contextType = UserContext;

export default UserPost;
