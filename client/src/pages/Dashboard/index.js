import React from 'react';
import ApiService from '../../services/ApiService';

import Navbar from '../../components/Navbar';
import ProfileBioPanel from '../../components/ProfileBioPanel';
import Newsfeed from '../../components/Newsfeed';
import TrendingPanel from '../../components/TrendingPanel';
import RecommendedPanel from '../../components/RecommendedPanel';

import styles from './styles.module.css';

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const user = await ApiService.getCurrentUser();
    this.setState( {
      user
    } ); 
  }

  render() {
    const { profileImage, fullName, userHandle, bio } = this.state?.user || {};
    return (
      <div className={styles.container}>
          <Navbar/>
          <div className={[styles.content, styles.contentSmallSize, styles.contentRegularSize].join(' ')}>
            { this.state.user && (
                <div className={styles.userBio}>
                  <ProfileBioPanel user={{ profileImage, fullName, userHandle, bio }}/>
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

export default Dashboard;
