import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'; 
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import { useHistory } from "react-router-dom";
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import './Layout.scss'
export default function Layout() {
    const history = useHistory();
    return (
        <div>
      <SideNav
        onSelect={(selected) => {
          switch (selected) {
            case 'userprofile':
              history.push('/UserProfile')
              break;
            case 'AdminDashboard':
              history.push('/AdminDashboard')
              break;
            default:
              break;
          }
        }}
      >
        <SideNav.Toggle />
        <SideNav.Nav defaultSelected="AdminDashboard">
          <NavItem eventKey="AdminDashboard">
            <NavIcon>
              <i className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
              Home
            </NavText>
          </NavItem>
          <NavItem eventKey="userprofile">
            <NavIcon>
              <i className="fa fa-fw fa-user" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
              User Profiles
            </NavText>
          </NavItem>
        </SideNav.Nav>
      </SideNav>
    </div>
    )
}
