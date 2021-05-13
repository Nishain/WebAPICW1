import React, { Component } from "react";
import TopNavigation from "./TopNavigation";
import $ from "jquery";
import axios from 'axios'
import cookie from 'js-cookie'
import { Route, Router, Switch } from "react-router";
import {Dashboard} from '../CustomerDashboard/Dashboard'
import { Link } from "react-router-dom";
import EditAccount from "./EditAccount";
export default class Home extends Component {
  hiddenFileInput = React.createRef();
  constructor(){
    super()
    this.signOut = this.signOut.bind(this)
  }
  state = {
    uploadedFiles:[],
  };
  componentDidMount(){
    console.log(this.props.match.path)
  }
  handleFileUpload = (evt) => {
    var uploadedFiles = this.state.uploadedFiles
    for (let index = 0; index < evt.target.files.length; index++) {
      uploadedFiles.push(evt.target.files[index].name);
    }
    this.setState({ uploadedFiles: uploadedFiles });
  };
  removeFile = (file) => {
      const deleteIndex = this.state.uploadedFiles.indexOf(file)
      this.state.uploadedFiles.splice(deleteIndex,1)
      this.setState({uploadedFiles:this.state.uploadedFiles})
  }
  async signOut(){
    await axios.get(process.env.REACT_APP_API_ENDPOINT+'auth/signout/')
    sessionStorage.removeItem('profileImage')
    cookie.remove('jwt')
    this.props.history.replace('/')
  }
  render() {
    return (
      <section>
        <Link to='Home/something' className="float-right">Go</Link>
          <TopNavigation items={2} signOut={this.signOut}/>
          
          <Switch>
            <Route exact path='/Home/' component={Dashboard} />
            <Route exact path='/Home/edit' component={EditAccount} />
          </Switch>
      </section>
    );
  }
}
