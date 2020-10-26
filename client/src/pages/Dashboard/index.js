import React from 'react';
import ApiService from '../../services/ApiService';

import Navbar from '../../components/Navbar';
import ProfileBioPanel from '../../components/ProfileBioPanel';
import Newsfeed from '../../components/Newsfeed';
import TrendingPanel from '../../components/TrendingPanel';
import RecommendedPanel from '../../components/RecommendedPanel';

import styles from './styles.module.css';
import UserContext from '../../context/UserContext';

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.container}>
          <Navbar/>
          <div className={[styles.content, styles.contentSmallSize, styles.contentRegularSize].join(' ')}>
            { this.context?.user && (
                <div className={styles.userBio}>
                  <ProfileBioPanel/>
                </div>
              )
            }
            <div className={[styles.newsFeedSmallSize, styles.newsFeedRegularSize].join(' ')}>
              <Newsfeed/>
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

Dashboard.contextType = UserContext;

export default Dashboard;
