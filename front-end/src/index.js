import React from "react";
import ReactDOM from "react-dom";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App";
import { Login } from "./pages/Login/Login";
import { Dashboard as Customer } from "./pages/CustomerDashboard/Dashboard";
import ProductView from "./pages/ProductView/ProductView";
import Cart from "./pages/Cart/Cart";
import Invoice from "./pages/Invoice/Invoice";
import adminLogin from "./pages/Admin/Login/adminLogin";
import Layout from "./pages/Admin/Shared/Layout/Layout";
import Dashboard from "./pages/Admin/Dashboard/Dashboard";
import UserProfile from "./pages/Admin/UserProfile/UserProfile";
import Orders from "./pages/Admin/Orders/Orders";
import CourierService from "./pages/Admin/CourierService/CourierService";
import Transaction from "./pages/Admin/Transaction/Transaction";
import Category from "./pages/Admin/Category/Category";
import reportWebVitals from "./reportWebVitals";
import endPoints from './pages/endPoints'
import 'bootstrap/dist/js/bootstrap'

import axios from 'axios'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import "antd/dist/antd.css"

axios.defaults.withCredentials = true
ReactDOM.render(
  <React.StrictMode>
  <Router>
    <Switch>
      <Route exact path="/" component={Login} />
      <Route exact path="/forgetPassword/:code" render={(props)=><Login {...props} forgetPassword={true} />} />
      <Route exact path="/ProductView" component={ProductView} /> 
      <Route exact path="/Cart" component={Cart} /> 
      <Route exact path="/Invoice" component={Invoice}/> 
      <Route exact path={endPoints.dashboard} component={Customer} />
      <Route exact path="/AdminLogin" component={adminLogin} />
      {/* <Route exact path="/AdminDashboard" component={Layout} /> */}
    </Switch>
  </Router>
  {/* admin */}
  <Router>
  <Layout/>
    <Switch>
      <Route exact path={endPoints.admin.dashboard} component={Dashboard} />
      <Route exact path={endPoints.admin.userProfile} component={UserProfile} />
      <Route exact path={endPoints.admin.orders} component={Orders} />
      <Route exact path={endPoints.admin.courierService} component={CourierService} />
      <Route exact path={endPoints.admin.transaction} component={Transaction} />
      <Route exact path={endPoints.admin.category} component={Category} />
    </Switch>
  </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
