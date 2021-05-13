import React, { useState, useEffect } from "react";
import { Input,Button } from "antd";
import { userEditTypes, userEditValues } from "./model";
import axios from "axios";
import "./checkOut.scss";

const CheckOut =()=> {
    const [userData, setUserData] = useState([]);
    const [userEditData, setUserEditData] = useState(userEditValues);
    const onChangeHandler = (type) => (e) => {
        debugger
        setUserEditData({
          ...userEditData,
          [type]: e.target.value,
        });
      };
    return (
      <div className="container">
          <div className="row">
              <div className="col-md-6">
              <div className="form-group">
              <label>Frist Name</label>
              <Input
                placeholder="Basic usage"
                value={userEditData.email}
                onChange={onChangeHandler(userEditTypes.email)}
              />
            </div>
            <div className="form-group">
              <label>Enter First Name</label>
              <Input
                placeholder="Basic usage"
                value={userEditData.firstName}
                onChange={onChangeHandler(userEditTypes.firstName)}
              />
            </div>
            <div className="form-group">
              <label>Enter Last Name</label>
              <Input
                placeholder="Basic usage"
                value={userEditData.lastName}
                onChange={onChangeHandler(userEditTypes.lastName)}
              />
            </div>
            <div className="form-group">
              <label>Enter Phone Number</label>
              <Input
                placeholder="Basic usage"
                value={userEditData.phoneNumber}
                onChange={onChangeHandler(userEditTypes.phoneNumber)}
              />
            </div>
            <div className="form-group">
              <label>Enter city</label>
              <Input
                placeholder="Basic usage"
                value={userEditData.city}
                onChange={onChangeHandler(userEditTypes.city)}
              />
            </div>
            <div className="form-group">
              <label>Enter zip Code</label>
              <Input
                placeholder="Basic usage"
                value={userEditData.zipCode}
                onChange={onChangeHandler(userEditTypes.zipCode)}
              />
            </div>

              </div>
              <div className="col-md-6">
              <label>Enter Email</label>
              
              </div>
          </div>
      </div>
 
    )
}
export default CheckOut