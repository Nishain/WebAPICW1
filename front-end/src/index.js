import React from "react";
import ReactDOM from "react-dom";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App";
import { Login } from "./pages/Login/Login";
import { Dashboard as Customer } from "./pages/CustomerDashboard/Dashboard";
import ViewProduct from "./pages/ViewProduct/ViewProduct";
import adminLogin from "./pages/Admin/Login/adminLogin";
import Layout from "./pages/Admin/Shared/Layout/Layout";
import Dashboard from "./pages/Admin/Dashboard/Dashboard";
import UserProfile from "./pages/Admin/UserProfile/UserProfile";
import Orders from "./pages/Admin/Orders/Orders";
import CourierService from "./pages/Admin/CourierService/CourierService";
import Transaction from "./pages/Admin/Transaction/Transaction";
import Category from "./pages/Admin/Category/Category";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";


ReactDOM.render(
  <React.StrictMode>
  <Router>
    <Switch>
      <Route exact path="/" component={Login} />
      <Route exact path="/Dashboard" component={Customer} />
      <Route exact path="/ViewProduct" component={ViewProduct} />
      <Route exact path="/AdminLogin" component={adminLogin} />
      

      {/* <Route exact path="/AdminDashboard" component={Layout} /> */}
    </Switch>
  </Router>
  {/* admin */}
  <Router>
    <Layout/>
    <Switch>
      <Route exact path="/Admin/AdminDashboard" component={Dashboard} />
      <Route exact path="/Admin/UserProfile" component={UserProfile} />
      <Route exact path="/Admin/Orders" component={Orders} />
      <Route exact path="/Admin/CourierService" component={CourierService} />
      <Route exact path="/Admin/Transaction" component={Transaction} />
      <Route exact path="/Admin/Category" component={Category} />
    </Switch>
  </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
