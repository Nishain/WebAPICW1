const express = require('express')
class Constants {
    url = `http://localhost:${process.env.PORT}/`
    IPBlockedMsg = 'Your IP is being tempolary blocked'
    exceedAttemptsLogin = 'you have exceeded 3 attempts.Your IP is backlisted now'
    designEmailContent(code,object){
        object.subject='Quick photo forget password'
        object.text = `follow this link for forget password - ${this.url}/forgetPassword?key=${code}`
        return object
    }
}
const contant = new Constants()
module.exports = contant