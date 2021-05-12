import { Component } from "react";
import {Link} from 'react-router-dom'
import icon from '../common/photo.png'
import '../CustomerDashboard/css/style.scss' 
import Cookie from 'js-cookie'
export default class TopNavigation extends Component {
  constructor(){
    super()
    this.signOut = this.signOut.bind(this)
  }
  signOut(){
    this.props.signOut()
  }
  getUserName = ()=>{
    if(!Cookie.get('jwt'))
      return ''
    console.log(Cookie.get('jwt').replace('j:',''))
    return JSON.parse(Cookie.get('jwt').replace('j:','')).username
  }
  render() {
    return (
      <nav className="navbar navbar-light bg-light">
        <Link className="navbar-brand">
          <img
            src={icon}
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt=""
          /><span>  Easy Quick Photo</span>
        </Link> 
        <form className="form-inline">
          <input
            className="form-control mr-sm-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
            style={{outlineColor:'black'}}
          />
          <button className="btn btn-outline-success my-2 my-sm-0" type="submit">
            Search
          </button>
        </form>
        <div className="btn-group">
  <button type="button" className="btn btn-info" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Menu <span class="badge badge-light">{this.props.notificationCount}</span>
  </button>
  <div className="dropdown-menu dropdown-menu-right">
    <div className="dropdown-item">{this.getUserName()}<img className="profileAvatar float-right" src={sessionStorage.getItem('profileImage')}/></div>
    <Link className="dropdown-item">My Cart <span className="badge badge-danger">4</span></Link> 
    <Link className="dropdown-item">Another action</Link> 
    <Link className="dropdown-item d-flex ">Notifications <span className="badge badge-danger">{this.props.notificationCount}</span></Link> 
    <div className="dropdown-divider"></div>
    <Link className="dropdown-item" onClick={this.signOut}>Sign Out</Link> 
  </div>
</div>
      </nav>
    );
  }
}
