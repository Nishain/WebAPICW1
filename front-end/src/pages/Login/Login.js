import "./css/Style.css";
import { setPasswordToggler, fullHeight } from "./js/main.js";
//import './js/popper.js'
import "./js/main";
import "popper.js";
import bg from "./images/bg.jpg";
import {router} from "react-router-dom";
import { Component } from "react";
import { InputFieldFragments } from "./InputFieldFragments";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { GoogleLogin } from "react-google-login";
import axios from "axios";
import { BottomButton } from "./BottomButton";
import cookie from 'js-cookie'
import {Modal,Button} from 'antd'
import endPoints from '../endPoints'
export class Login extends Component {
  state = { isBlocked: false,
    isLogin: true,
    isForgetCodeInvalid:false,
    shouldShowEmailConfimation:false,
    proccessEmailValidation:false
   };
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
    this.requestForgetPassword = this.requestForgetPassword.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.login = this.login.bind(this);
    this.swapFunctionality = this.swapFunctionality.bind(this);
    this.rememberMe = this.rememberMe.bind(this)
    this.submitEmailConfirmCode = this.submitEmailConfirmCode.bind(this)
    this.onEmailConfimationClose = this.onEmailConfimationClose.bind(this)
  }
  
  componentDidMount() {
    fullHeight();
    setPasswordToggler();
    this.getDistricts()
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
  async requestForgetPassword() {
    const result = (await axios.post(
        process.env.REACT_APP_API_ENDPOINT + "users/forgetPassword",
        { email: this.state.Email }
      )).data
    if(this.showErrorFieldsIfNeeded(result))
      return
    else if(result.success)
        Modal.success({content:'a link has submited for your email address to password reset'})
    console.log(result);
  }
  async ping() {
    await axios.get(process.env.REACT_APP_API_ENDPOINT);
    if(this.props.forgetPassword){
      const result = (await axios.put(process.env.REACT_APP_API_ENDPOINT + "users/forgetPassword/" + this.props.match.params.code)).data
      if(result.forgetPasswordPing && !result.userExist){
        this.setState({isForgetCodeInvalid:true})
      }
    }

  }
  swapFunctionality() {
    this.setState({ isLogin: !this.state.isLogin });
    this.invalidateFields([]);
    this.setState({ errorMessage: undefined });
  }
  getParamsFromInput(modelFields){
    var params = {};
    for (const key in this.state) {
      const index = modelFields.findIndex(
        (mf) =>
          mf.toLocaleLowerCase() == key.replaceAll(" ", "").toLocaleLowerCase()
      );
      if (index < 0) continue;
      params[modelFields[index]] = this.state[key];
    }
    return params
  }
  async registerAccount() {
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
      "district"
    ];
    const result = (
      await axios.post(process.env.REACT_APP_API_ENDPOINT + "users/", this.getParamsFromInput(modelFields))
    ).data;
    
    if (!this.showErrorFieldsIfNeeded(result)) {
      if(result.success){
        return this.requestEmailConfirmation()
        //return this.props.history.replace(endPoints.dashboard)
      }
      this.setState({ errorMessage: undefined });
    }
  }
  
  showErrorFieldsIfNeeded(result,externalFields=undefined){
    if (result.fieldError) {
      var fields = []
      if(externalFields){
        fields = externalFields
      }else
        fields = result.fields
      this.invalidateFields(fields);
      this.setState({ errorMessage: result.msg });
      return true
    }
    return false
  }
  async forgetPassword(){
    var params = this.getParamsFromInput(['password','confirmPassword'])
    params.editPassword = true
    const result = (await axios.put(process.env.REACT_APP_API_ENDPOINT + "users/forgetPassword/" + this.props.match.params.code,
    params)).data
    if(this.showErrorFieldsIfNeeded(result))
      return
    if(result.passwordChanged){
      return this.props.history.replace('/')
    }  
    console.log(result)
  }
  tapLoginOrRegisterBtn() {
    if(this.props.forgetPassword){
      this.forgetPassword()
    }
    else if (this.state.isLogin) this.login();
    else this.registerAccount();
  }
  invalidateFields(invalidFields) {
    const allInputFields = document.querySelectorAll("input.form-control");
    const formatedInvalidFields = invalidFields.map((field) =>
      field.toLowerCase()
    );
    for (const inputField of allInputFields) {
      let isFieldInvalid = formatedInvalidFields.includes(
        inputField.getAttribute("name").replaceAll(" ", "").toLowerCase()
      );
      if (isFieldInvalid) {
        inputField.className = "form-control is-invalid";
      } else inputField.className = "form-control";
    }
  }
 
  login() {
    let modelPaths = ["email","password"]
    axios
      .post(process.env.REACT_APP_API_ENDPOINT + "auth/",this.getParamsFromInput(modelPaths))
      .then((response) => {
        console.log(response.data); 
        if(response.data.requiredToConfirm){
          this.setState({ errorMessage: undefined });
          this.requestEmailConfirmation()
          return
        }
        if (response.data.authorize) {
          this.setState({ errorMessage: undefined });
          return this.props.history.replace(endPoints.dashboard);
        } else if (response.data.attemptsRemain != undefined) {
          this.setState({
            errorMessage: `Invalid credentials only ${response.data.attemptsRemain} attempts remaining`,
          });
        } 
        this.showErrorFieldsIfNeeded(response.data)
      })
      .catch((error) => {
        console.log(error);
      });
  }
  async getDistricts(){
    const result = (await axios.get(process.env.REACT_APP_API_ENDPOINT + 'districts/')).data
    this.setState({districts:result.list.map(district=>district.name)})
    //console.log(this.state.districts)
  }
   renderInputFieldFragments(isLogin){
    var book = isLogin ? [["Email","Password"]] :[
      ["Email","Password","Confirm Password"],
      [ "First Name","Last Name","Phone Number","Address"],
      [ "City","Zip Code","District"]
    ]
    if(this.props.forgetPassword){
      book = [["Password","Confirm Password"]]
    }
    if(!isLogin)
      setPasswordToggler() 
    return book.map((page,index)=>
        <div className="half p-4 py-md-5">
          {index == 0 && <div className="w-100">
            <h3 className="mb-4">{this.props.forgetPassword ? 'Forget Password' : `Sign ${isLogin ? 'In':'Up'}`}</h3>
          </div>
          }
        <InputFieldFragments
        fields={page}
        dropDownItems={this.state.districts}
        handleInputChange={this.handleInputChange} />
        {index == (book.length -1) && <BottomButton 
          errorMessage={this.state.errorMessage} 
          buttonLabel={this.props.forgetPassword ? 'Change Password' : (this.state.isLogin ? 'Login' : 'Sign Up')}
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
              <a onClick={this.requestForgetPassword}>Forgot Password</a>
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
  async requestEmailConfirmation(){
    const result = (await axios.post(process.env.REACT_APP_API_ENDPOINT + 'users/verify/',{email:this.state.Email})).data
    if(this.showErrorFieldsIfNeeded(result))
      return
    console.log(result)  
    if(result.success){
      this.setState({shouldShowEmailConfimation:true})
    }
  }
  async submitEmailConfirmCode(){
    const code = this.state['Email Verification code']
    console.log(this.state)
    this.setState({proccessEmailValidation:true})
    const result = (await axios.post(process.env.REACT_APP_API_ENDPOINT + 'users/verify/',{email:this.state.Email,code:code})).data
    this.setState({proccessEmailValidation:false})
    if(result.confirmSuccess){
      this.onEmailConfimationClose()
      this.props.history.replace(endPoints.dashboard)
    }else{
      this.showErrorFieldsIfNeeded(result,['EmailVerificationCode'])
    }
  }
  onEmailConfimationClose(){
    this.setState({
      shouldShowEmailConfimation:false,
      proccessEmailValidation:false
    })
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
      <Modal visible={this.state.shouldShowEmailConfimation} confirmLoading={this.state.proccessEmailValidation}
       closable={false}
       maskClosable={false}
       onCancel={this.onEmailConfimationClose}
       onOk={this.submitEmailConfirmCode}>
        <p>We have sent you the code to your email address.Check it and type the code below</p>
        <InputFieldFragments
        fields={["Email Verification code"]}
        handleInputChange={this.handleInputChange} />
        </Modal>
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
                  {this.state.isBlocked || (this.props.forgetPassword && this.state.isForgetCodeInvalid) ? (
                    <div className="card text-center">
                      <div className="card-body">
                        <h5 className="card-title">{this.state.isBlocked ? 'Your IP is tempolary blocked':'Invalid Forget password code'}</h5>
                        <p className="card-text">
                          { (this.state.isBlocked && <>This is the result of attempting to fail to login
                          within 3 attempts</>) || <>Invalid forget password code please check your email address</>
                          }
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
