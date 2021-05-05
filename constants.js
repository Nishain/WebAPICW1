module.exports = {
    Port:0,
    url:`http://localhost:${this.Port}/`,
    designEmailContent:(code,object)=>{
        object.subject='Quick photo forget password'
        object.text = `follow this link for forget password - ${url}/forgetPassword?key=${code}`
        return object
    }
}