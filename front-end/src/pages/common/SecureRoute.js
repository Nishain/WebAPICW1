import axios from "axios";
import { Route } from "react-router";
import { Login } from "../Login/Login";
import { ServerErrorPage } from '../staticPages/ServerErrorPage'
export default class SecureRoute extends Route {
  state = {
    secureFlag: undefined,
  };
  
  async componentDidMount(){
    axios.interceptors.response.use(
        (response) => {
            this.setFlag(undefined)
          return response;
        },
        (error) => {
          if(!error.response){
            this.setFlag('serverError')
            return error.response
          }
          console.log(error.response.data);
          if (!this.props.index && error.response.status == 401 && error.response.data.invalidToken) {  
            this.setFlag("invalidToken")
          } else if (
            error.response.status == 401 &&
            error.response.data.IPBlocked
          ) {
            this.setFlag({ secureFlag: "IPBlock" });
          }else if((!this.props.index && error.response.data.accountInActive) || (this.props.index && error.response.data.onlogin && error.response.data.accountInActive)){
            this.setFlag("AccountDisabled")
          }else if(!this.props.index && error.response.data.adminDomain){
            this.setFlag("AdminDomain")
          }
          return error.response;
        }
      );
  }
  setFlag(flag){
      if(this.state.secureFlag == flag)
        return
      this.setState({secureFlag : flag})  
  }
  clone(obj) {
    var newObj = {};
    for (const key in obj) {
      newObj[key] = obj[key];
    }
    return newObj;
  }
   flagToErrorMapping = {
    IPBlock : {
        title:'Your IP is being blocked',
        message : 'Your IP is being blocked as a result of failure to login within 3 attempts.This effect will be only tempolary'
    },
    AccountDisabled : {
        title : 'Your account is disabled',
        message : 'Your account is being disabled by the admin.Please contact the admin for more details'
    },
    AdminDomain : {
      title : 'Those endpoints are reserved for admin',
      message : 'you are redirected back because you try to enter restricted domain. You need admin privileges to enter these domain'
    }
   }   
   render() { 
    var propsClone = this.clone(this.props);
    if (this.state.secureFlag) {
      if(this.state.secureFlag == 'serverError')
        return <ServerErrorPage />
      propsClone.component = undefined;
      propsClone.render = (props) => {
        var loginProps = props;
        loginProps.redirect = true
        if(Object.keys(this.flagToErrorMapping).includes(this.state.secureFlag)){
            loginProps.errorTitle = this.flagToErrorMapping[this.state.secureFlag].title
            loginProps.errorMessage = this.flagToErrorMapping[this.state.secureFlag].message
        }
        return <Login {...loginProps} />;
      };
    }
    return <Route {...propsClone} />;
  }
}
