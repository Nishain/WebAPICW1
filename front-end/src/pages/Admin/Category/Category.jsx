import React from "react";
import { Input } from 'antd';
export default function Category() {
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
                <Input placeholder="Basic usage" />
              </div>
              <div className="form-group">
              <Input placeholder="Amount" />
              </div>
              <button
                className="btn btn-primary"
                type="button"
                onclick="addCategory()"
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
