import React from 'react';
import ApiService from '../../services/ApiService';

import Navbar from '../../components/Navbar';
import ProfileBioPanel from '../../components/ProfileBioPanel';
import Userfeed from '../../components/Userfeed';
import TrendingPanel from '../../components/TrendingPanel';
import RecommendedPanel from '../../components/RecommendedPanel';

import styles from './styles.module.css';
import UserContext from '../../context/UserContext';

class UserProfile extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { userId } = this.props.match.params;
    return (
      <div className={styles.container}>
          <Navbar/>
          <div className={[styles.content, styles.contentSmallSize, styles.contentRegularSize].join(' ')}>
            <div className={[styles.userFeedSmallSize, styles.userFeedRegularSize].join(' ')}>
              <Userfeed userId={userId}/>
            </div>
            <div className={styles.sidePanels}>
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
