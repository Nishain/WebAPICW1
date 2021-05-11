import { Component } from "react";

export class InputFieldFragments extends Component {
  
  renderDropdown(fieldName,data){
    
    return <div className="form-group" key={fieldName}>
      <label className="label" htmlFor="password">
        {fieldName}
      </label>
      <select class="form-control" name={fieldName} onChange={this.props.handleInputChange}>
        {
          data.map(val=><option className="dropdown-item" value={val} key={val}>{val}</option>)
        }
      </select>
    </div>
  }
  
  renderPassword(fieldName){
      return <div className="form-group" key={fieldName}>
      <label className="label" htmlFor="password">
        {fieldName}
      </label>
      <input
        id={fieldName.toLowerCase().replace(' ','')}
        type="password"
        name={fieldName}
        className="form-control passwordField"
        placeholder={fieldName}
        onChange={this.props.handleInputChange}
        required
      />
      <div class="invalid-feedback"> Please check your password</div>
      <span
        toggle={`#${fieldName.toLowerCase().replace(' ','')}`}
        className="fa fa-fw fa-eye field-icon toggle-password"
      ></span>
    </div>
  }  
  render() {
    const inputFields = this.props.fields.map((fieldProp) => {
      var field
      var value = undefined
      if(typeof fieldProp == 'string')
        field = fieldProp
      else{
        field = fieldProp.field
        value = fieldProp.default
      }
      let extraInputProps = {}
      if(value){
        extraInputProps = {value:value}
        fieldProp.setDefaultValueSilently(field,value)
      }
      return (
        field.toLowerCase() == 'district' ? this.renderDropdown(field,this.props.dropDownItems) : 
        field.toLowerCase().includes('password') ? this.renderPassword(field) : 
        <div className="form-group mt-3" key={field}>
          <label className="label" htmlFor="name">
            {field}
          </label>
          <input
            type="text"
            name={field}
            {...extraInputProps}
            className="form-control"
            placeholder={field}
            onChange={this.props.handleInputChange}
            required
          />
          <div class="invalid-feedback"> Please choose a valid {field}</div>
        </div>
      );
    });
    return inputFields
  }
}
