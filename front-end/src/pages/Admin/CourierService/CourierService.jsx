import React, { useEffect, useState, useCallback } from "react";
import { Input,Button } from "antd";
import CustomTextBox from "../Shared/commonTextBox/CustomTextBox";
import{CourierServiceTypes,CourierServiceValue} from "./extranalCourierServiceData"
import axios from 'axios'
import CourierServiceData from "../Data/districts.json";
export default function CourierService() {
  const [values, setValues] = useState(CourierServiceData);
  const [valueCourierService, setCourierService] = useState("");

  const onChangeInputHandler = (id, price) => {
    values.map((x, i) => {
      if (x.id == id) {
        x.value = price;
      }

      setValues([...values]);
    });
  };
const changeCourierService = (type) => (e) => {
   
  setCourierService(e.target.value);
}
const addCourierService = async () =>{
  
  values.map((x, i) => {
    
      x.CourierServiceName = valueCourierService;
    

    setValues([...values]);
  });

  const result = await axios.post(
    "http://localhost:5000/Admin/courierservice",values
    
  )
}
  return (
    <div className="container">
      <h1>Courier Service</h1>
      <div className="row">
        <div className="col-md-4"></div>
        <div className="col-md-4">
          <div className="form-group">
            <label>Courier Service Name</label>
            <Input placeholder="Basic usage" value={valueCourierService} onChange={changeCourierService(CourierServiceTypes.CourierServiceType)}/>
          </div>
        </div>
        <div className="col-md-4"></div>
      </div>
      <div className="row">
        {values.length > 0 &&
          values.map((data) => (
            <div className="col-md-4">
              <CustomTextBox obj={data} func={onChangeInputHandler} />
            </div>
          ))}
          <div className="col-12">
          <Button type="primary" onClick={addCourierService}>Add Courier Service</Button>
          </div>
      </div>
      
    </div>
  );
}
