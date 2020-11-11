import React from 'react';
import {useHistory} from 'react-router-dom';
import NavbarSearch from '../NavbarSearch';
import Utils from '../../utils';
import styles from './styles.module.scss';

import { PersonCircle, ThreeDots } from 'react-bootstrap-icons';

function Navbar() {
  const history = useHistory();
  return (
    <div className={styles.container}>
      <h1 className={styles.logo} onClick={()=>Utils.navigateTo( history,'/' )}>Twidr</h1>
      <div className={styles.search}>
        <NavbarSearch/>
      </div>
      <div className={styles.userActions}>
        <span><PersonCircle size={26}/></span>
        <span><ThreeDots size={26}/></span>
      </div>
    </div>
  );
}

export default Navbar;
