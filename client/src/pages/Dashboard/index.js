import React from 'react';

import Navbar from '../../components/Navbar';
import ProfileBioPanel from '../../components/ProfileBioPanel';
import Userfeed from '../../components/Userfeed';
import SideMenuPanel from '../../components/SideMenuPanel';
import TrendingPanel from '../../components/TrendingPanel';
import RecommendedPanel from '../../components/RecommendedPanel';

import styles from './styles.module.scss';
import UserContext from '../../context/UserContext';
import Utils from '../../utils';

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.container}>
        <Navbar/>
        <div className={styles.mainThreeColumn}>
          <div className={styles.mainLeftCol}>
            { this.context?.user && (
              <div className={styles.userBio}>
                <ProfileBioPanel/>
              </div>
            )
            }
            <SideMenuPanel/>
          </div>
          <div className={styles.mainMidCol}>
            <Userfeed/>
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

Dashboard.contextType = UserContext;

export default Dashboard;
