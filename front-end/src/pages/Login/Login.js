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
import { BottomButton } from "./BottomPrimaryButton";
import cookie from 'js-cookie'
import {Modal,Button} from 'antd'
import endPoints from '../endPoints'
import bycrypt from 'bcryptjs'
import {encode as urlSafeEncode} from 'url-safe-base64'
import BottomSecondaryButton from "./BottomSecondaryButton";
import helper from "../common/helper";
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
    console.log(process.env.REACT_APP_PASSWORD_SALT)
    if(this.props.redirect){
      if(this.props.errorTitle){
        return
      }
      return this.props.history.replace('/')
    }
    fullHeight();
    setPasswordToggler();
    this.getDistricts()
    this.setState({rememberMe:localStorage.getItem('rememberMe') || 1})
    
    this.checkValidForgetPasswordGateway();
  }

  handleGoogleSignIn =  (googleData) => {
    console.log(googleData);
    const userID = googleData.profileObj.googleId
    const email = googleData.profileObj.email
    this.thirdPartySignIn(userID,email,'google',googleData.profileObj.imageUrl)
  };
  handleGoogleSignUpError = (error) => {
    console.log(error)
  }
  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  setDefaultValueSilently = (fieldName,value)=>{
    this.state[fieldName] = value
  }
  onFacebookSignIn = (data) =>{
    window.FB.logout();
    console.log(data);
    const userID = data.userID
    this.thirdPartySignIn(userID,data.email,'facebook',data.picture.data.url)
  }
  
  async requestForgetPassword() {
    const result = (await axios.post(
        process.env.REACT_APP_API_ENDPOINT + "auth/forgetPassword",
        { email: this.state.Email }
      )).data
    if(this.showErrorFieldsIfNeeded(result))
      return
    else if(result.success)
        Modal.success({content:'a link has submited for your email address to password reset'})
    console.log(result);
  }
  async checkValidForgetPasswordGateway() {
    await axios.get(process.env.REACT_APP_API_ENDPOINT);
    if(this.props.forgetPassword){
      const result = (await axios.put(process.env.REACT_APP_API_ENDPOINT + "auth/forgetPassword/" + this.props.match.params.code)).data
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
      "district",
      "adminPermissionCode"
    ];
    var postBody = this.getParamsFromInput(modelFields)
    if(this.state.thirdPartySignUp){
      postBody['isProviderEnabledAccount'] = true
      postBody['quickSignInID'] = await bycrypt.hash(this.state.thirdPartySignUp.userID,process.env.REACT_APP_PASSWORD_SALT)
    }else{
      postBody['password'] = await bycrypt.hash(postBody['password'],process.env.REACT_APP_PASSWORD_SALT)
    postBody['confirmPassword'] = await bycrypt.hash(postBody['confirmPassword'],process.env.REACT_APP_PASSWORD_SALT)
    }
    const result = (
      await axios.post(process.env.REACT_APP_API_ENDPOINT + "users/", postBody)
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
    const forgetPasswordCode = this.props.match.params.code
    var params = this.getParamsFromInput(['password','confirmPassword'])
    
    params.editPassword = true
    params.password = await helper.hash(params.password)
    params.confirmPassword = await helper.hash(params.confirmPassword)
    const result = (await axios.put(process.env.REACT_APP_API_ENDPOINT + "auth/forgetPassword/" + forgetPasswordCode,
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
  navigateToDashbaord(isUserAdmin) {
    this.props.history.replace(isUserAdmin ? endPoints.admin.dashboard : endPoints.dashboard);
  }
  handleAuthentication(data,isThirdPartyAuthentication,thirdParyInfo=undefined){
    if(data.salt)
      return { salt : data.salt }
    if(data.requiredToConfirm){
      this.setState({ errorMessage: undefined });
      if(isThirdPartyAuthentication){
        this.state.Email = thirdParyInfo.email
      }
      this.requestEmailConfirmation()
      return
    }
    if (data.authorize) {
      this.setState({ errorMessage: undefined });
      if(isThirdPartyAuthentication)
        sessionStorage.setItem('profileImage',thirdParyInfo.profileImage) //setting the profile image from the provider
      return this.navigateToDashbaord(data.isAdmin)
    } else if(isThirdPartyAuthentication && data.requireRegistration){
      return this.setState({isLogin:false,thirdPartySignUp:thirdParyInfo})
    }
    else if (data.attemptsRemain != undefined) {
      this.setState({
        errorMessage: `Invalid credentials only ${data.attemptsRemain} attempts remaining`,
      });
    }
    if(!isThirdPartyAuthentication)
      this.showErrorFieldsIfNeeded(data)
  }
  async getAuthSaltAndHash(valueToHash,email,isThirdPartyProviderAuthentication,thirdPartyAuthInfo=undefined){
    const result = (await axios.put(process.env.REACT_APP_API_ENDPOINT + 'auth/salt/',
    {email:email,thirdPartyProvider:isThirdPartyProviderAuthentication})).data
    const authenticationResult = this.handleAuthentication(result,isThirdPartyProviderAuthentication,thirdPartyAuthInfo)
    if(!authenticationResult || !authenticationResult.salt || !valueToHash)
      return {hashedValueAvailable:false} 
    const firstHash = await bycrypt.hash(valueToHash,process.env.REACT_APP_PASSWORD_SALT)  
    const secondHash = await bycrypt.hash(firstHash,authenticationResult.salt)  
    return {
      hashedValueAvailable : true,
      firstHash : firstHash,
      finalHash : secondHash
    }  
  }
   thirdPartySignIn = async(userID,email,provider,profileImage)=>{
    const thirdParty = {
      email : email,
      provider : provider,
      userID : userID,
      profileImage : profileImage
    }
    const hashedData = await this.getAuthSaltAndHash(userID,email,true,thirdParty)
    if(!hashedData.hashedValueAvailable)
      return
    const result = (await axios.post(process.env.REACT_APP_API_ENDPOINT + "auth/link",
      {linkID:hashedData.firstHash,reHashedLinkID:hashedData.finalHash})).data  
    this.handleAuthentication(result,true,thirdParty)
  }
  login = async () => {
    let modelPaths = ["email","password"]
    var paramBody = this.getParamsFromInput(modelPaths)
    const hashData = await this.getAuthSaltAndHash(paramBody.password,paramBody.email,false)
    if(!hashData.hashedValueAvailable)
      return
    paramBody.password = hashData.finalHash
    axios
      .post(process.env.REACT_APP_API_ENDPOINT + "auth/",paramBody)
      .then((response)  => {
        this.handleAuthentication(response.data,false)
      })
      .catch((error) => {
        console.log(error);
      });
  }
  async getDistricts(){
    const result = (await axios.get(process.env.REACT_APP_API_ENDPOINT + 'districts/')).data
    this.setState({districts:[""].concat(result.list.map(district=>district.name))})
    //console.log(this.state.districts)
  }
  removeThirdParty = () => {
    this.setState({thirdPartySignUp:undefined})
  }
   renderInputFieldFragments(isLogin){
    var book = isLogin ? [["Email","Password"]] :[
      this.state.thirdPartySignUp ? 
      [{
        default :this.state.thirdPartySignUp.email,
        field:"Email",
        setDefaultValueSilently:this.setDefaultValueSilently
      }] : ["Email","Password","Confirm Password","adminPermissionCode"],
      [ "First Name","Last Name","Phone Number","Address"],
      [ "City","Zip Code","District"]
    ]
    if(this.props.forgetPassword){
      book = [["Password","Confirm Password"]]
    }

    if(!isLogin)
      setPasswordToggler() 
    const elements = book.map((page,index)=>
        <div className="half p-4 py-md-5">
          {index == 0 && <div className="w-100">
            <h3 className="mb-4">{this.props.forgetPassword ? 'Forget Password' :
             `Sign ${isLogin ? 'In':this.state.thirdPartySignUp?`Up with ${this.state.thirdPartySignUp.provider}`:'Up'}`}</h3>
             {this.state.thirdPartySignUp && <button className="btn btn-danger" onClick={this.removeThirdParty}>remove provider</button> }
          </div>
          }
        <InputFieldFragments
        fields={page}
        dropDownItems={this.state.districts}
        handleInputChange={this.handleInputChange} />
        {index == (book.length -1) && <><BottomButton 
          errorMessage={this.state.errorMessage} 
          buttonLabel={this.props.forgetPassword ? 'Change Password' : (this.state.isLogin ? 'Login' : 'Sign Up')}
          isLogin={this.state.isLogin} 
          tapLoginOrRegisterBtn={this.tapLoginOrRegisterBtn}/>
          <BottomSecondaryButton isLogin={isLogin} swapFunctionality={this.swapFunctionality} /></>}
        </div>)
        if(this.state.thirdPartySignUp)
          this.state.thirdPartySignUp.email = undefined //silently update the state without rendering the DOM again...
        return elements
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
                appId={process.env.REACT_APP_FACEBOOK_ID}
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
                fields="email,picture"
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
                onSuccess={this.handleGoogleSignIn}
                onFailure={this.handleGoogleSignUpError}
                cookiePolicy={"single_host_origin"}
              />
            </p>
          </div>
        </div>
      </form>
    );
  }
  async requestEmailConfirmation(){
    const result = (await axios.post(process.env.REACT_APP_API_ENDPOINT + 'auth/verify/',{email:this.state.Email})).data
    if(this.showErrorFieldsIfNeeded(result))
      return
    if(result.success){
      this.setState({shouldShowEmailConfimation:true})
    }
  }
  async submitEmailConfirmCode(){
    const code = this.state['Email Verification code']
    this.setState({proccessEmailValidation:true})
    const result = (await axios.post(process.env.REACT_APP_API_ENDPOINT + 'auth/verify/',{email:this.state.Email,code:code})).data
    this.setState({proccessEmailValidation:false})
    if(result.confirmSuccess){
      this.onEmailConfimationClose()
      this.navigateToDashbaord(result.isAdmin)
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
          objectFit: "contain",
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
                  {this.props.errorTitle || (this.props.forgetPassword && this.state.isForgetCodeInvalid) ? (
                    <div className="card text-center">
                      <div className="card-body">
                        <h5 className="card-title">{this.props.forgetPassword ? 'Invalid Forget password code':this.props.errorTitle}</h5>
                        <p className="card-text">
                          { (this.props.errorMessage && <>{this.props.errorMessage}</>) || <>Invalid forget password code please check your email address</>
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
