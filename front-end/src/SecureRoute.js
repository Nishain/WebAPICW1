import axios from "axios";
import { Route } from "react-router";
import { Dashboard } from "./pages/CustomerDashboard/Dashboard";
import { Login } from "./pages/Login/Login";
export default class SecureRoute extends Route {
  state = {
    secureFlag: undefined,
  };
  
  async componentDidMount(){
    axios.interceptors.response.use(
        (response) => {
            console.log(response)
          return response;
        },
        (error) => {
          console.log(error);
          if (error.response.status == 401 && error.response.data.invalidToken) {
            console.log('cookie block')  
            this.setState({ secureFlag: "invalidToken" });
          } else if (
            error.response.status == 401 &&
            error.response.data.IPBlocked
          ) {
            this.setState({ secureFlag: "IPBlock" });
          }
          return error.response;
        }
      );
       axios.get(process.env.REACT_APP_API_ENDPOINT)
  }
  clone(obj) {
    var newObj = {};
    for (const key in obj) {
      newObj[key] = obj[key];
    }
    return newObj;
  }
   render() { 
    var propsClone = this.clone(this.props);
    if (this.state.secureFlag) {
      propsClone.component = undefined;
      propsClone.render = (props) => {
        var loginProps = props;
        if (this.state.secureFlag == "IPBlock") 
            loginProps.isBlocked = true;
        return <Login {...loginProps} />;
      };
    }
    return <Route {...propsClone} />;
  }
}
