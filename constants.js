const express = require('express')
class Constants {
    clientURL = 'http://localhost:3000'
    url = `http://localhost:${process.env.PORT}/`
    emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    regexMapping = {
        email : {
            regex:this.emailRegex,
            message:'Enter a valid email'
        }
    }
    IPBlockedMsg = 'Your IP is being tempolary blocked'
    exceedAttemptsLogin = 'you have exceeded 3 attempts.Your IP is backlisted now'
    designEmailContent(code,object){
        object.subject='Quick photo forget password'
        object.text = `follow this link for forget password - ${this.clientURL}/forgetPassword/${code}`
        return object
    }
    designEmailConfimationBody(code,object){
        object.subject='Quick photo Email confirmation'
        object.text = `enter this code for email verification - ${code}`
    }
}
const contant = new Constants()
module.exports = contant