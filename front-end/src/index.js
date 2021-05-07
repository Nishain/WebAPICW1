import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter,Route} from 'react-router-dom'
import './index.css';
import App from './App';
import {Login} from './pages/Login/Login'
import {Dashboard as Customer} from './pages/CustomerDashboard/Dashboard'
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.js';
import axios from 'axios'

axios.defaults.withCredentials = true
ReactDOM.render(
  <BrowserRouter>
    <Route exact path='/' component = {Login} />
    <Route exact path="/Dashboard" component = {Customer}/>
  </BrowserRouter>,
  document.getElementById('root') 
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
