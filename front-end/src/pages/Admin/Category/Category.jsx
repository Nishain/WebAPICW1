import React, {  useState } from "react";
import { Input } from 'antd';
import{CategoryValues,CategoryTypes} from "./extranalData"



export default function Category() {
  const [category, setCategory] = useState(CategoryValues)
  const onChangeHandler = (type) => (e) => {
   
    setCategory({
      ...category,
      [type]: e.target.value,
    });
  
  }
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <div className="card card-primary">
            <div className="card-header">
              <h3 className="card-title">Add Category</h3>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label>Enter Category Name</label>
                <Input placeholder="Basic usage"  value={category.categoryname} onChange={onChangeHandler(
                        CategoryTypes.category
                      )}/>
              </div>
              <div className="form-group">
              <Input placeholder="Amount" value={category.price} onChange={onChangeHandler(
                        CategoryTypes.price
                      )} />
              </div>
              <button
                className="btn btn-primary"
                type="button"
                // onclick="addCategory()"
              >
                Add
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6"></div>
      </div>
    </div>
  );
}
