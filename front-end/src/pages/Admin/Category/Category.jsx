import React, {  useState } from "react";
import { Input,Button } from 'antd';
import{CategoryValues,CategoryTypes} from "./extranalData"
import axios from 'axios'


export default function Category() {
  const [category, setCategory] = useState(CategoryValues)
  const [loading, setLoading] = useState(false)
  const onChangeHandler = (type) => (e) => {
   
    setCategory({
      ...category,
      [type]: e.target.value,
    });
  
  }

  const  addCategory = async ()=>
  {
    
    setLoading(true)
    const result = await axios.post(
      "http://localhost:5000/Admin/category",category
      
    )
    if(result && result.data)
    {
      setLoading(false)
    }
    else{
      setLoading(false)
    }
    
    
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
                <Input placeholder="Basic usage"  value={category.categoryName} onChange={onChangeHandler(
                        CategoryTypes.category
                      )}/>
              </div>
              <div className="form-group">
              <Input placeholder="Amount" value={category.price} onChange={onChangeHandler(
                        CategoryTypes.price
                      )} />
              </div>

              <Button type="primary" onClick={addCategory} loading={loading}>Primary Button</Button>
            </div>
          </div>
        </div>
        <div className="col-md-6"></div>
      </div>
    </div>
  );
}
