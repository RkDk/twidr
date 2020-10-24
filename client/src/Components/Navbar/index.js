import React from 'react';
import NavbarSearch from '../NavbarSearch';
import styles from './styles.module.css';

import { PersonCircle, ThreeDots } from 'react-bootstrap-icons';

function Navbar() {
  return (
    <div className={[styles.container, styles.containerSmallSize, styles.containerRegularSize].join(' ')}>
      <div className={styles.logo}>
        Twidr
      </div>
      <div className={styles.search}>
        <NavbarSearch/>
      </div>
      <div className={[styles.userActions, styles.userActionsSmallSize].join(' ')}>
        <span><PersonCircle size={26}/></span>
        <span><ThreeDots size={26}/></span>
      </div>
    </div>
  );
}

export default Navbar;
