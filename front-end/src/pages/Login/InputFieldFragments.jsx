import { Component } from "react";

export class InputFieldFragments extends Component {
  renderPassword(fieldName){
      return <div className="form-group">
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
    const inputFields = this.props.fields.map((field) => {
      return (
        field.toLowerCase().includes('password') ? this.renderPassword(field) : 
        <div className="form-group mt-3">
          <label className="label" htmlFor="name">
            {field}
          </label>
          <input
            type="text"
            name={field}
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
