import React from "react";
import ReactDOM from "react-dom";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import { Login } from "./pages/Login/Login";
import Home from "./pages/CustomerDashboard/Home";

import ProductView from "./pages/ProductView/ProductView";
import Page404 from '../src/pages/staticPages/404Page/404Page'
import adminLogin from "./pages/Admin/Login/adminLogin";

import reportWebVitals from "./reportWebVitals";
import SecureRoute from '../src/pages/common/SecureRoute'
import endPoints from './pages/endPoints'
import {AdminRoute} from '../src/AdminRoute'
import 'bootstrap/dist/js/bootstrap'

import axios from 'axios'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import "antd/dist/antd.css"
// import ProductView from "./pages/ProductView/ProductView";

axios.defaults.withCredentials = true
function render(){
  ReactDOM.render(
    <React.StrictMode>
      <Router>
        <Switch>
          <SecureRoute index={true} exact path="/" component={Login} />
          <Route exact  path={endPoints.forgetPassword} render={(props)=><Login {...props} forgetPassword={true} />} />
          <SecureRoute exact path={endPoints.productsView} component={ProductView} /> 
          <SecureRoute  path={endPoints.dashboard} component={Home} />
          <SecureRoute exact path={endPoints.adminLogin} component={adminLogin} /> 
          
          {/* <Route exact path="/AdminDashboard" component={Layout} /> */}
        </Switch>
      </Router>
      {/* admin */}
      <Router>
        <SecureRoute path='/Admin' component={AdminRoute} />
        
      </Router>
      
      </React.StrictMode>,
    document.getElementById("root")
  );
}
render()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
