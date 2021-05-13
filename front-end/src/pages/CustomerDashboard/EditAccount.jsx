import { Component } from "react";
import axios from 'axios'
import {InputFieldFragments} from '../Login/InputFieldFragments'
export default class EditAccount extends Component{
    state = {districts:[]}
    handleInputChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }
    async getDistricts(){
        const result = (await axios.get(process.env.REACT_APP_API_ENDPOINT + 'districts/')).data
        console.log(result)
        this.setState({districts:[""].concat(result.list.map(district=>district.name))})
        //console.log(this.state.districts)
      }
    constructor(){
        super()
        this.getDistricts()
    }  
    renderForm(){
        const book = [
            ["Email","Password","Confirm Password"],
            [ "First Name","Last Name","Phone Number","Address"],
            [ "City","Zip Code","District"]
        ]
        return book.map(page=>{
            return <div className="half p-4 py-md-5">
                <InputFieldFragments
                fields={page}
                dropDownItems={this.state.districts}
                handleInputChange={this.handleInputChange} />
            </div>
        })
    }
    getDefaultValues(){
        
    }
    render(){

        return (
         <div className='col-md-12 col-lg-10'>   
        <form className="signin-form d-md-flex">
            <h1>hello</h1>
            {this.renderForm()}
        </form>
        </div>
        )
    }
}