import React, { Component } from 'react'

export default class Home extends Component {
    render() {
        return (
            <div classNameName="container">
            <div id="login-row" className="row justify-content-center align-items-center">
                <div id="login-column" className="col-md-6">
                    <div id="login-box" className="col-md-12">
                        
                            <h3 className="text-center text-info">Login</h3>
                            <div className="form-group">
                                <label for="username" className="text-info">Username:</label>
                                <input type="text" name="username" id="username" className="form-control"/>
                            </div>
                            <div className="form-group">
                                <label for="password" className="text-info">Password:</label>
                                <input type="text" name="password" id="password" className="form-control"/>
                            </div>
                            <div className="form-group">
                                <label for="remember-me" className="text-info"><span>Remember me</span> <span><input id="remember-me" name="remember-me" type="checkbox"/></span></label>
                                <input type="submit" name="submit" className="btn btn-info btn-md" value="submit"/>
                            </div>
                            <div id="register-link" className="text-right">
                                <a href="#" className="text-info">Register here</a>
                            </div>
                        
                    </div>
                </div>
            </div>
            </div>
        )
    }
}
