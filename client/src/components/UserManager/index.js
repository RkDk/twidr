import React from 'react';
import UserContext, {defaultUser} from '../../context/UserContext';
import ApiService from '../../services/ApiService';

class UserManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userContext: {
        ...defaultUser,
        updateUser: this.updateUser.bind(this),
        fetchCurrentUser: this.fetchCurrentUser.bind(this),
        logoutUser: this.logoutUser.bind(this)
      }
    };
  }
  updateUser(update) {
    this.setUser(Object.assign({}, this.state.userContext?.user || {}, update));
  }
  setUser(user) {
    const {userContext} = this.state;
    this.setState({
      userContext: {
        ...userContext,
        fetchedUser: true,
        user
      }
    });
  }
  logoutUser() {
    this.setUser(null);
  }
  async fetchCurrentUser() {
    const user = await ApiService.getCurrentUser();
    this.setUser(user);
  }
  render() {
    return (
      <UserContext.Provider value={this.state.userContext}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export default UserManager;