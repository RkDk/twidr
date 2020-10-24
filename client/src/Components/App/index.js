import { render } from '@testing-library/react';
import React, { useContext, useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import UserContext, { defaultUser } from '../../Context/UserContext';
import ApiService from '../../Services/ApiService';
import UserManager from '../UserManager';

import Dashboard from '../../Pages/Dashboard';
import Login from '../../Pages/Login';
import UnknownPage from '../../Pages/UnknownPage';

function PrivateComponent(props) {
  const userContext = useContext( UserContext );
  const [ isComponentMounted, setComponentMounted ] = useState( false );
  useEffect(() => {
    userContext.fetchCurrentUser().then(() => setComponentMounted(true));
  }, []);
  if( !isComponentMounted ) {
    return (<></>);
  }
  return (
    <>
      {userContext.user? (
        <>{props.children}</>
        ) : 
        (<Redirect to="/login"/>)
      }
    </>
  );
}
function PrivateRoute(props) {
  const { children, ...params } = props;
  return (
    <Route {...params}>
      <PrivateComponent>
        {children}
      </PrivateComponent>
    </Route>
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
          <UserManager>
            <PrivateRoute exact path="/">
              <Dashboard/>
            </PrivateRoute>
            <Route path="/login">
              <Login/>
            </Route>
          </UserManager>
          <UnknownPage/>
        </Switch>
      </Router>
    );
  }
}

export default App;
