import axios from "axios";
import { Route } from "react-router";
import { Login } from "./pages/Login/Login";
import { useHistory } from 'react-router-dom'
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
          console.log(error);
          if (!this.props.index && error.response.status == 401 && error.response.data.invalidToken) {  
            this.setFlag("invalidToken")
          } else if (
            error.response.status == 401 &&
            error.response.data.IPBlocked
          ) {
            this.setFlag({ secureFlag: "IPBlock" });
          }else if((!this.props.index && error.response.data.accountInActive) || (this.props.index && error.response.data.onlogin && error.response.data.accountInActive)){
            this.setFlag("AccountDisabled")
          }
          return error.response;
        }
      );
       axios.get(process.env.REACT_APP_API_ENDPOINT)
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
    }
   }   
   render() { 
    var propsClone = this.clone(this.props);
    if (this.state.secureFlag) {
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
