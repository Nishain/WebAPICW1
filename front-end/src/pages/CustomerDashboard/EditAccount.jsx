import { Component } from "react";
import axios from 'axios'
import {InputFieldFragments} from '../Login/InputFieldFragments'
import Helper from '../common/helper'
export default class EditAccount extends Component{
    state = {districts:[]}
    activeAccountEmailAdress = undefined
    handleInputChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }
    async getDistricts(){
        const result = (await axios.get(process.env.REACT_APP_API_ENDPOINT + 'districts/')).data
        this.setState({districts:[""].concat(result.list.map(district=>district.name))})
        //console.log(this.state.districts)
      }
    constructor(){
        super() 
    }  
    componentDidMount(){
        this.getDistricts()
        this.getDefaultValues()
    }
    renderForm(){
        
        const book = [
            this.state.accountSignUpType == 'normal'? ["Email","Password","Confirm Password"] : ["Email"],
            [ "First Name","Last Name","Phone Number","Address"],
            [ "City","Zip Code","District"]
        ]
        return book.map((page,index)=>{
            return <div className="half p-4 py-md-5">
                {index == 0 && <h3 className="mb-4">Edit Profile</h3>}
                <InputFieldFragments 
                fields={page}
                dropDownItems={this.state.districts}
                handleInputChange={this.handleInputChange} />
                {index == book.length -1 && <button type="button" onClick={this.submitChanges} className="btn btn-info">Submit Changes</button>}
            </div>
        })
    }
    submitChanges = async ()=>{
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
          var updatingParams = {}
          for(const key in this.state){
              let modelField = modelFields.find(mf =>
                 mf.toLowerCase() == Helper.simpleAndNoSpace(key))
              if(!modelField)  
                continue
             if(typeof this.state[key] == 'string' && this.state[key].length == 0)
                continue //ignore empty text   
             updatingParams[modelField] = this.state[key]   
          }
          if(updatingParams.password){
              const hashedPassword = await Helper.hash(updatingParams.password)
              updatingParams.password = hashedPassword
              const hashedConfirmPassword = await Helper.hash(updatingParams.confirmPassword || '')
              updatingParams.confirmPassword = hashedConfirmPassword
          }
          console.log(`password ${updatingParams.password}`)
          console.log(`confirm password ${updatingParams.confirmPassword}`)
          const result = (await axios.put(process.env.REACT_APP_API_ENDPOINT + 'users/email/auto',updatingParams)).data
          Helper.showErrorFieldsIfNeeded(result,undefined,document)
          console.log(result)
    }
    async getDefaultValues(){
        const serverData = (await axios.get(process.env.REACT_APP_API_ENDPOINT + 'users/email/auto')).data
        if(!serverData.found){
            console.log(serverData)
            return
        }
        const result = serverData.user    
        console.log(result)
        this.activeAccountEmailAdress = result.email    
        const isNormalSignUpAccount = result.signUpMode == 'normal'
        const dataKeys = Object.keys(result)
        this.setState({accountSignUpType : isNormalSignUpAccount ? 'normal' : 'thirdParty'})
        const allInputFields = document.querySelectorAll(".form-group  input.form-control,.form-group select.form-control");
        for(let inputField of allInputFields){
            let matchingKey =  dataKeys.find(key=>key.toLowerCase() == inputField.getAttribute("name").replaceAll(' ','').toLowerCase())
            if(!matchingKey)
                continue   
            inputField.value = result[matchingKey]    
        }
    }
    render(){

        return (
            <div className="row justify-content-center">   
         <div className='col-md-12 col-lg-10'>   
         <div className="card">
        <form className="signin-form d-md-flex">
            {this.renderForm()}
            
        </form>
        </div>
        </div>
        </div>
        )
    }
}