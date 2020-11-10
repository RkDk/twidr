import React from 'react';
import ApiService from '../../services/ApiService';

import Navbar from '../../components/Navbar';
import Userfeed from '../../components/Userfeed';
import TrendingPanel from '../../components/TrendingPanel';
import RecommendedPanel from '../../components/RecommendedPanel';

import styles from './styles.module.scss';
import UserContext from '../../context/UserContext';
import ProfileBioPanel from '../../components/ProfileBioPanel';
import Utils from '../../utils';
import SideMenuPanel from '../../components/SideMenuPanel';

class UserProfile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        user: null
    };
  }

  async componentDidMount() {
      const user = await ApiService.getUser(  this.props.match.params.userId );
      this.setState( {
          user 
      });
  }

  render() {
    const { user } = this.state;
    if( !user ) {
        return (<></>);
    }
    return (
      <div className={styles.container}>
          <Navbar/>
          <div className={styles.mainThreeColumn}>
            <div className={Utils.concatStyles(styles.mainLeftCol,styles.sideMenu,styles.hideOnSmallScreen)}>
                <SideMenuPanel includeDashboardLink={true}/>
            </div>
            <div className={styles.mainMidCol}>
              <ProfileBioPanel isBanner={true} user={user}/>
              <Userfeed userId={user.id}/>
            </div>
            <div className={styles.mainRightCol}>
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
