import './css/Style.css'
import  {setPasswordToggler,fullHeight} from './js/main.js'
//import './js/popper.js'
import './js/main'
import  'popper.js'

import bg from './images/bg.jpg'
import { Component } from 'react'
import {GoogleLogin,useGoogleLogout,} from 'react-google-login'
import { data } from 'jquery'
import axios from 'axios'

 export class Login extends Component{
   state = {}
   constructor(){
     super()
     this.sendEmail = this.sendEmail.bind(this)
     this.handleInputChange = this.handleInputChange.bind(this)
   }
   componentDidMount(){
    fullHeight()
    setPasswordToggler()
   }

  onSignOutSuccess = async (googleData)=>{
    console.log('successfully logged out')
    console.log(googleData)
  }
  onSignOutFail = async (data)=>{
    console.log('logged out failed')
    console.log(data)
  }
  
   handleLogin = async (googleData)=>{
    console.log(googleData)
  }
  handleInputChange(event){
    this.setState({[event.target.name]: event.target.value})
  }
  async sendEmail(){
    const result = await (await axios.post(process.env.REACT_APP_API_ENDPOINT + 'users/forgetPassword',{'email':this.state.email})).data
    console.log(result)
  }
  render(){
    return(
      <div className="img js-fullheight" style={{backgroundImage:`linear-gradient(rgba(0, 0, 0, 0.527),rgba(0, 0, 0, 0.5)) ,url(${bg})`,objectFit:'cover'}}>
       <section className="ftco-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center mb-5">
              <h2 className="heading-section" style={{color:'white'}}>Quick potos Login</h2>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-12 col-lg-7">
              <div className="login-wrap">
                <form action="#" className="signin-form d-md-flex">
                  <div className="half p-4 py-md-5">
                    <div className="w-100">
                      <h3 className="mb-4">Sign In</h3>
                    </div>
                    <div className="form-group mt-3">
                      <label className="label" htmlFor="name">Username</label>
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
                      <label className="label" htmlFor="password">Password</label>
                      <input
                        id="password-field"
                        type="password"
                        name="password"
                        className="form-control"
                        placeholder="Password"
                        required
                      />
                      <span
                        toggle="#password-field"
                        className="fa fa-fw fa-eye field-icon toggle-password"
                      ></span>
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
                        <label className="checkbox-wrap checkbox-primary mb-0"
                          >Remember Me
                          <input type="checkbox" onChange={()=>{}} />
                          <span className="checkmark"></span>
                        </label>
                      </div>
                      <div className="w-50 text-md-right">
                        <a onClick={this.sendEmail}>Forgot Password</a>
                      </div>
                    </div>
                    <p className="w-100 text-center" style={{color: "white"}}>
                      &mdash; Or Sign In With &mdash;
                    </p>
                    <div className="w-100">
                      <p className="social-media d-flex justify-content-center">
                        <a
                          href="#"
                          className="social-icon d-flex align-items-center justify-content-center"
                          ><span className="fa fa-facebook"></span
                        ></a>
                        <GoogleLogin
                          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                          isSignedIn={false}
                          
                          render={btnProps=><a
                            className="social-icon d-flex align-items-center justify-content-center" onClick={btnProps.onClick} disabled={btnProps.disabled}
                            ><span className="fa fa-google"></span
                          ></a>}
                          onSuccess={this.handleLogin}
                          onFailure={this.handleLogin}
                          cookiePolicy={'single_host_origin'} />
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
  </div>
      );
  }
    
}

