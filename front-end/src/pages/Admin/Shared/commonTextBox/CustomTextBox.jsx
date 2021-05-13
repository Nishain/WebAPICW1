import React from 'react'
import { Input } from "antd";
import { event } from 'jquery';

 const CustomTextBox = (props) => {

  return (
    <div className="form-group">
      <label>{props.obj.districtName}</label>
      <Input placeholder="Basic usage" onChange={(event)=>props.func(props.obj.id,event.target.value)} value={props.obj.value}  onFocus={(event) => props.onFocus(props.obj.id,event.target.value)}
        onBlur={(event) => props.onBlur(props.obj.id,event.target.value)} key={props.keyvalue}/>
    </div>
  )
}
export default CustomTextBox
