import "./css/Style.css";
import { setPasswordToggler, fullHeight } from "./js/main.js";
//import './js/popper.js'
import "./js/main";
import "popper.js";
import bg from "./images/bg.jpg";
import { Component } from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { GoogleLogin } from "react-google-login";
import { data } from "jquery";
import axios from "axios";
export class Login extends Component {
  state = { isBlocked: false };
  constructor() {
    super();
    this.sendEmail = this.sendEmail.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.login = this.login.bind(this)
  }
  componentDidMount() {
    fullHeight();
    setPasswordToggler();
    axios.interceptors.response.use((response)=>{return response},(error)=>{
      if (error.response.status == 401 && error.response.data.IPBlocked){
        this.setState({isBlocked:true})
      }
      return error.response
    })
    this.ping()
  }

  handleLogin = async (googleData) => {
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
   axios.get(process.env.REACT_APP_API_ENDPOINT)
  }
  login(){
    console.log(this.props)
    let email = this.state.email
    let password = this.state.password
     axios.post(process.env.REACT_APP_API_ENDPOINT+'auth/',{email:email,password:password}).then(response=>{
      console.log(response.data)//attemptsRemain
      
      if(response.data.authorize)
        this.props.history.replace('/Dashboard')
      else if(response.data.attemptsRemain){
        this.setState({attemptsRemain:response.data.attemptsRemain})
      }
     }).catch((error)=>{
       console.log(error)
     })
  }
  renderLoginForm() {
    return (
      <form className="signin-form d-md-flex">
        <div className="half p-4 py-md-5">
          <div className="w-100">
            <h3 className="mb-4">Sign In</h3>
          </div>
          <div className="form-group mt-3">
            <label className="label" htmlFor="name">
              Username
            </label>
            <input
              type="text"
              name="email"
              className="form-control"
              placeholder="Username"
              onChange={this.handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password-field"
              type="password"
              name="password"
              className="form-control"
              placeholder="Password"
              onChange={this.handleInputChange}
              required
            />
            <span
              toggle="#password-field"
              className="fa fa-fw fa-eye field-icon toggle-password"
            ></span>
          </div>
          <div className="form-group">
          <div class="alert alert-danger" role="alert">
              Invalid credentials attempts remaining {this.state.attemptsRemain - 1}
          </div>
              <button type="button" className="form-control btn btn-secondary rounded submit px-3" onClick={this.login}>Login</button>
          </div>
        </div>
        <div className="half p-4 py-md-5 bg-primary">
          <div className="form-group">
            <button
              type="submit"
              className="form-control btn btn-secondary rounded submit px-3"
            >
              Sign me in now
            </button>
          </div>
          <div className="form-group d-md-flex">
            <div className="w-50 text-left">
              <label className="checkbox-wrap checkbox-primary mb-0">
                Remember Me
                <input type="checkbox" onChange={() => {}} />
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
                onSuccess={this.handleLogin}
                onFailure={this.handleLogin}
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
        className="img js-fullheight"
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
              <div className="col-md-12 col-lg-7">
                <div className="login-wrap">
                
                  {this.state.isBlocked ? (
                    <div class="card text-center">
                    <div class="card-body">
                      <h5 class="card-title">Your IP is tempolary blocked</h5>
                      <p class="card-text">This is the result of attempting to fail to login within 3 attempts</p>
                      
                    </div>
                  </div>
                  ) : (
                    this.renderLoginForm()
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
