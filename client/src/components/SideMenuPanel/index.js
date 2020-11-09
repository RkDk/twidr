import React from 'react';
import styles from './styles.module.scss';

function SideMenuPanel(props) {
    return (
        <div className={styles.container}>
            { props.includeDashboardLink && <h1>Dashboard</h1> }
            <h1>{"What's trending"}</h1>
            <h1>Discover</h1>
            <h1>Manage</h1>
            <h1>Profile</h1>
            <h1>Settings</h1>
        </div>
    );
}

export default SideMenuPanel;