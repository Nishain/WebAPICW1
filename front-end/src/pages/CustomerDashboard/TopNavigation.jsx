import { Component } from "react";
import icon from '../common/photo.png'

export default class TopNavigation extends Component {
  constructor(){
    super()
    this.signOut = this.signOut.bind(this)
  }
  signOut(){
    this.props.signOut()
  }
  render() {
    return (
      <nav className="navbar navbar-light bg-light">
        <a className="navbar-brand">
          <img
            src={icon}
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt=""
          /><span>  Easy Quick Photo</span>
        </a>
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
    <a className="dropdown-item \">My Cart <span className="badge badge-danger">4</span></a>
    <a className="dropdown-item">Another action</a>
    <a className="dropdown-item d-flex ">Notifications <span className="badge badge-danger">{this.props.notificationCount}</span></a>
    <div className="dropdown-divider"></div>
    <a className="dropdown-item" onClick={this.signOut}>Sign Out</a>
  </div>
</div>
      </nav>
    );
  }
}
