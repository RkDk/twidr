import React from 'react';

const defaultUser = {
  fetchedUser: false,
  user: null
};

const UserContext = React.createContext(defaultUser);

export { defaultUser };
export default UserContext;