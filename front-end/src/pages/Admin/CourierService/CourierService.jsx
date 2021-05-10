import React, { useEffect, useState, useCallback } from "react";
import { Input } from "antd";
import CustomTextBox from "../Shared/commonTextBox/CustomTextBox";
import CourierServiceData from "../Data/districts.json";
export default function CourierService() {
  const [values, setValues] = useState(CourierServiceData);

  const onChangeInputHandler = (id, price) => {
    values.map((x, i) => {
      if (x.id == id) {
        x.value = price;
      }

      setValues([...values]);
    });
  };

  return (
    <div className="container">
      <h1>Courier Service</h1>
      <div className="row">
        <div className="col-md-4"></div>
        <div className="col-md-4">
          <div className="form-group">
            <label>Courier Service Name</label>
            <Input placeholder="Basic usage" />
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
      </div>
    </div>
  );
}
