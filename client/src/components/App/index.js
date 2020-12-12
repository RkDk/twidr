import React, {useContext, useEffect, useState} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';

import UserContext from '../../context/UserContext';
import UserManager from '../UserManager';

import Dashboard from '../../pages/Dashboard';
import UserProfile from '../../pages/UserProfile';
import UserPost from '../../pages/UserPost';
import Login from '../../pages/Login';
import UnknownPage from '../../pages/UnknownPage';

function PrivateComponent(props) {
  const userContext = useContext(UserContext);
  const [isComponentMounted, setComponentMounted] = useState(false);
  useEffect(() => {
    userContext.fetchCurrentUser().then(() => setComponentMounted(true));
  }, []);
  if(!isComponentMounted) {
    return (<></>);
  }
  return (
    <>
      {userContext.user ? (
        <>{props.children}</>
      ) : 
        (<Redirect to="/login"/>)
      }
    </>
  );
}
function PrivateRoute(props) {
  const {component: Component, ...params} = props;
  return (
    <Route {...params} render={
      (_props) => 
        <PrivateComponent>
          <Component {..._props}/>
        </PrivateComponent>
    }/>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/login">
            <Login/>
          </Route>
          <UserManager>
            <Switch>
              <PrivateRoute exact path="/" component={Dashboard}/>
              <PrivateRoute exact path="/user/:userId" component={UserProfile}/>
              <PrivateRoute exact path="/user/:userId/followers" component={UserProfile}/>
              <PrivateRoute exact path="/user/:userId/following" component={UserProfile}/>
              <PrivateRoute exact path="/user/:userId/post/:postId" component={UserPost}/>
              <UnknownPage/>
            </Switch>
          </UserManager>
        </Switch>
      </Router>
    );
  }
}

export default App;
