import React from 'react';
import ApiService from '../../services/ApiService';

import Navbar from '../../components/Navbar';
import Userfeed from '../../components/Userfeed';
import TrendingPanel from '../../components/TrendingPanel';
import RecommendedPanel from '../../components/RecommendedPanel';

import styles from './styles.module.scss';
import UserContext from '../../context/UserContext';
import ProfileBioBanner from '../../components/ProfileBioBanner';

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
          <div className={[styles.content, styles.contentSmallSize, styles.contentRegularSize].join(' ')}>
            <div className={[styles.userFeed, styles.userFeedSmallSize, styles.userFeedRegularSize].join(' ')}>
              <ProfileBioBanner user={user}/>
              <Userfeed userId={user.id}/>
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
