import axios from 'axios'
import bycrypt from 'bcryptjs'
export default {
    simpleAndNoSpace:(text)=>{
        return text.replaceAll(' ','').toLowerCase()
    },
    showErrorFieldsIfNeeded(result,externalFields=undefined,document){
        if (result.fieldError) {
          var fields = []
          if(externalFields){
            fields = externalFields
          }else
            fields = result.fields
          this.invalidateFields(fields,document);
          return true
        }
        return false
      },
    invalidateFields(invalidFields,document) {
        const allInputFields = document.querySelectorAll("input.form-control,select.form-control");
        const formatedInvalidFields = invalidFields.map((field) =>
          field.toLowerCase()
        );
        for (const inputField of allInputFields) {
          if(inputField.getAttribute("name") == null)  
            continue
          let isFieldInvalid = formatedInvalidFields.includes(
            inputField.getAttribute("name").replaceAll(" ", "").toLowerCase()
          );
          if (isFieldInvalid) {
            inputField.className = "form-control is-invalid";
          } else inputField.className = "form-control";
        }
      },

    getAuthSalt: async(identifier,isThirdPartyProvider,identifierType='email')=>{
        //forgetPasswordCode
        var params = {thirdPartyProvider:isThirdPartyProvider}
        params[identifierType == 'email' ? 'email' : 'forgetPasswordCode'] = identifier
        const result = (await axios.put(process.env.REACT_APP_API_ENDPOINT + 'auth/salt/',
        )).data
        return result.salt
    },
    hash: async(valueToHash)=>{
        return await bycrypt.hash(valueToHash,process.env.REACT_APP_PASSWORD_SALT)  
    },
    doubleHash: async (valueToHash,salt)=>{
        const firstHash = await bycrypt.hash(valueToHash,process.env.REACT_APP_PASSWORD_SALT)  
        const secondHash = await bycrypt.hash(firstHash,salt)  
        return secondHash  
    }
}