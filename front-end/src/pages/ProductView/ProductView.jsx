import React, { useState, useEffect } from "react";
import { Input, Button, Image } from "antd";
import axios from "axios";
import { editQty, qtyTypes } from "./model";
import cookie from 'js-cookie';

const ProductView = () => {
  const [category, setCategory] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0.0);
  const [categorySelect, setCategorySelect] = useState("");
  const [loadCategory, setLoadCategory] = useState([]);
  const [categoryEdit, setCategoryEdit] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  const onChangeSelectHandler = (e) => {
    setCategorySelect(e.target.value);
    getFrechApi(e.target.value);
  }; 
  const fetchApi = async () => {
    const result = await axios.get("http://localhost:5000/Admin/category");

    setLoadCategory(result ? result.data : []);
  };
  useEffect(() => {
    fetchApi();
  }, []);
const addToCart=async()=>{
  const url2 = `http://localhost:5000/Admin/category/${categorySelect}`;
    const result2 = await axios.get(url2);
    // const result3 = (await axios.get(process.env.REACT_APP_API_ENDPOINT + 'users/email/auto')).data
    debugger
  const url=`http://localhost:5000/addToCart`
    const result = await axios.post(
      url,
    
      {
        
        "photoURL":"test.png",
        "categoryName":result2.data.categoryName,
        "qty":category,
        "Price":totalPrice,
        "unitPrice": unitPrice
        
}

    );
    debugger
}
  const getFrechApi = async (id) => {
    const url = `http://localhost:5000/Admin/category/${id}`;
    const result = await axios.get(url);

    setCategoryEdit(result && result.data ? result.data.price : "");
    setTotalPrice(Number(result.data.price) * Number(category));
    setUnitPrice(result.data.price);
    debugger
  };
  const changeQTY = (type) => (e) => {
    debugger;
    setCategory(e.target.value);
    setTotalPrice(Number(categoryEdit) * Number(e.target.value));
  };
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6" style={{ padding: 50 }}>
          <Image
            width={500}
            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          />
        </div>

        <div className="col-md-6" style={{ padding: 50 }}>
          <div className="form-group">
            <label>Category Name</label>
            <select
              className="form-control"
              value={categorySelect}
              onChange={onChangeSelectHandler}
            >
              <option value="0">Select Category</option>
              {loadCategory.length > 0 &&
                loadCategory.map((element, index) => (
                  <option value={element._id} key={index}>
                    {element.categoryName}
                  </option>
                ))}
            </select>
          </div>
          <div className="form-group">
            <label>Quentity</label>
            <Input
              type="number"
              value={category}
              min="1"
              max="1000"
              step="1"
              onChange={changeQTY(qtyTypes.qty)}
            />
          </div>
          <div className="form-group">
            <label>Price</label> <br />
            <h2>
              <span>{totalPrice}</span>
            </h2>
          </div>
          <Button type="primary" onClick={addToCart}>Add to Cart</Button>
        </div>
      </div>
    </div>
  );
};
export default ProductView;
