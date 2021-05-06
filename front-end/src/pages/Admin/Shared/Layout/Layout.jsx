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
              history.push('/Admin/UserProfile')
              break;
            case 'AdminDashboard':
              history.push('/Admin/AdminDashboard')
              break;
            case 'Orders':
              history.push('/Admin/Orders')
              break;
            case 'CourierService':
              history.push('/Admin/CourierService')
              break;
            case 'Transaction':
              history.push('/Admin/Transaction')
              break;
            case 'Category':
              history.push('/Admin/Category')
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
          <NavItem eventKey="Orders">
            <NavIcon>
              <i className="fa fa-fw fa-sticky-note" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
              Orders
            </NavText>
          </NavItem>
          <NavItem eventKey="CourierService">
            <NavIcon>
              <i className="fa fa-fw fa-truck" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
            Courier Service
            </NavText>
          </NavItem>
          <NavItem eventKey="Transaction">
            <NavIcon>
              <i className="fa fa-fw fa-dollar" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
            Transaction
            </NavText>
          </NavItem>
          <NavItem eventKey="Category">
            <NavIcon>
              <i className="fa fa-fw fa-list" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
            Category
            </NavText>
          </NavItem>
        </SideNav.Nav>
      </SideNav>
    </div>
    )
}
