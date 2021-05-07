import "./css/Style.css";
import { setPasswordToggler, fullHeight } from "./js/main.js";
//import './js/popper.js'
import "./js/main";
import "popper.js";
import bg from "./images/bg.jpg";
import ReactDom from "react-dom";
import { Component } from "react";
import { InputFieldFragments } from "./InputFieldFragments";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { GoogleLogin } from "react-google-login";
import axios from "axios";
import { BottomButton } from "./BottomButton";
import cookie from 'js-cookie'

export class Login extends Component {
  state = { isBlocked: false, isLogin: true };
  registerfields = [
    "Email",
    "Password",
    "Confirm Password",
    "First Name",
    "Last Name",
    "Phone Number",
    "Address",
    "City",
    "Zip Code",
  ];
  constructor() {
    super();
    
   // Axios.defaults.withCredentials = true
    this.tapLoginOrRegisterBtn = this.tapLoginOrRegisterBtn.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.login = this.login.bind(this);
    this.swapFunctionality = this.swapFunctionality.bind(this);
    this.rememberMe = this.rememberMe.bind(this)
  }
  
  componentDidMount() {
    fullHeight();
    setPasswordToggler();
    
    this.setState({rememberMe:localStorage.getItem('rememberMe') || 1})
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.log(error)
        if (error.response.status == 401 && error.response.data.invalidToken){
          console.log('ouch! invalid token')
        }
        else if (error.response.status == 401 && error.response.data.IPBlocked) {
          this.setState({ isBlocked: true });
        }
        return error.response;
      }
    );
    this.ping();
  }

  handleGoogleSignUp = async (googleData) => {
    console.log(googleData);
  };
  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  onFacebookSignIn(data) {
    window.FB.logout();
    console.log(data);
  }
  async sendEmail() {
    const result = await (
      await axios.post(
        process.env.REACT_APP_API_ENDPOINT + "users/forgetPassword",
        { email: this.state.email }
      )
    ).data;
    console.log(result);
  }
  async ping() {
    await axios.get(process.env.REACT_APP_API_ENDPOINT);
  }
  swapFunctionality() {
    this.setState({ isLogin: !this.state.isLogin });
    this.invalidateFields([]);
    this.setState({ errorMessage: undefined });
  }
  async registerAccount() {
    var params = {};
    const modelFields = [
      "firstName",
      "lastName",
      "email",
      "password",
      "confirmPassword",
      "address",
      "city",
      "zipCode",
      "phoneNumber",
    ];
    for (const key in this.state) {
      const index = modelFields.findIndex(
        (mf) =>
          mf.toLocaleLowerCase() == key.replace(" ", "").toLocaleLowerCase()
      );
      if (index < 0) continue;
      params[modelFields[index]] = this.state[key];
    }
    const result = (
      await axios.post(process.env.REACT_APP_API_ENDPOINT + "users/", params)
    ).data;
    
    if (result.fieldError) {
      this.invalidateFields(result.fields);
      this.setState({ errorMessage: result.msg });
    } else {
      if(result.success){
        this.props.history.replace('/Dashboard')
      }
      this.setState({ errorMessage: undefined });
    }
  }
  tapLoginOrRegisterBtn() {
    if (this.state.isLogin) this.login();
    else this.registerAccount();
  }
  invalidateFields(invalidFields) {
    const allInputFields = document.querySelectorAll("input.form-control");
    const formatedInvalidFields = invalidFields.map((field) =>
      field.toLowerCase()
    );
    for (const inputField of allInputFields) {
      let isFieldInvalid = formatedInvalidFields.includes(
        inputField.getAttribute("name").replace(" ", "").toLowerCase()
      );
      if (isFieldInvalid) {
        inputField.className = "form-control is-invalid";
      } else inputField.className = "form-control";
    }
  }
 
  login() {
    let modelPaths = ["email","password"]
    var params = {}
    for(const key in this.state){
      params[modelPaths.find(p=>p.toLowerCase() == key.toLowerCase())] = this.state[key]
    }
    axios
      .post(process.env.REACT_APP_API_ENDPOINT + "auth/",params)
      .then((response) => {
        console.log(response.data); 
        if (response.data.authorize) {
          this.setState({ errorMessage: undefined });
          //this.props.history.replace("/Dashboard");
        } else if (response.data.attemptsRemain != undefined) {
          this.setState({
            errorMessage: `Invalid credentials only ${response.data.attemptsRemain} attempts remaining`,
          });
        } else if (response.data.fieldError) {
          this.invalidateFields(response.data.fields);
          this.setState({ errorMessage: response.data.msg });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  
  renderInputFieldFragments(isLogin){
    const book = isLogin ? [["Email","Password"]] :[
      ["Email","Password","Confirm Password"],
      [ "First Name","Last Name","Phone Number","Address"],
      [ "City","Zip Code"]
    ]
    if(!isLogin)
      setPasswordToggler()
    return book.map((page,index)=>
        <div className="half p-4 py-md-5">
          {index == 0 && <div className="w-100">
            <h3 className="mb-4">Sign {isLogin ? 'In':'Up'}</h3>
          </div>
          }
        <InputFieldFragments
        fields={page}
        handleInputChange={this.handleInputChange} />
        {index == (book.length -1) && <BottomButton 
          errorMessage={this.state.errorMessage} 
          isLogin={this.state.isLogin} 
          tapLoginOrRegisterBtn={this.tapLoginOrRegisterBtn}/>}
        </div>)
  }
 
  rememberMe(event){
    this.setState({rememberMe:this.state.rememberMe == 1 ? 2:1})
    localStorage.setItem('rememberMe',this.state.rememberMe)
  }
  renderForm() {
    return (
      <form className="signin-form d-md-flex">
        {this.renderInputFieldFragments(this.state.isLogin)}
        <div className="half p-4 py-md-5 bg-primary">
          <div className="form-group">
            <button
              onClick={this.swapFunctionality}
              type="submit"
              className="form-control btn btn-secondary rounded submit px-3"
            >
              {this.state.isLogin ? "Sign me in now" : "Back to login"}
            </button>
          </div>
          <div className="form-group d-md-flex">
            <div className="w-50 text-left">
              <label className="checkbox-wrap checkbox-primary mb-0">
                Remember Me
                <input type="checkbox" checked={this.state.rememberMe == 2} onChange={this.rememberMe} />
                <span className="checkmark"></span>
              </label>
            </div>
            <div className="w-50 text-md-right">
              <a onClick={this.sendEmail}>Forgot Password</a>
            </div>
          </div>
          <p className="w-100 text-center" style={{ color: "white" }}>
            &mdash; Or Sign In With &mdash;
          </p>
          <div className="w-100">
            <p className="social-media d-flex justify-content-center">
              <FacebookLogin
                appId="4334533943277653"
                render={(btnProps) => (
                  <a
                    className="social-icon d-flex align-items-center justify-content-center"
                    onClick={btnProps.onClick}
                    disabled={btnProps.disabled}
                  >
                    <span className="fa fa-facebook"></span>
                  </a>
                )}
                callback={this.onFacebookSignIn}
                fields="name,email,picture"
              />

              <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                isSignedIn={false}
                render={(btnProps) => (
                  <a
                    className="social-icon d-flex align-items-center justify-content-center"
                    onClick={btnProps.onClick}
                    disabled={btnProps.disabled}
                  >
                    <span className="fa fa-google"></span>
                  </a>
                )}
                onSuccess={this.handleGoogleSignUp}
                onFailure={this.handleGoogleSignUp}
                cookiePolicy={"single_host_origin"}
              />
            </p>
          </div>
        </div>
      </form>
    );
  }
  render() {
    return (
      <div
        className="img"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.527),rgba(0, 0, 0, 0.5)) ,url(${bg})`,
          objectFit: "cover",
        }}
      >
        <section className="ftco-section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6 text-center mb-5">
                <h2 className="heading-section" style={{ color: "white" }}>
                  Quick potos Login
                </h2>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className={this.state.isLogin ? "col-md-12 col-lg-7" : "col-md-12 col-lg-10"} >
                <div className="login-wrap">
                  {this.state.isBlocked ? (
                    <div class="card text-center">
                      <div class="card-body">
                        <h5 class="card-title">Your IP is tempolary blocked</h5>
                        <p class="card-text">
                          This is the result of attempting to fail to login
                          within 3 attempts
                        </p>
                      </div>
                    </div>
                  ) : (
                    this.renderForm()
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
