import React, { useState, useEffect } from "react";
import { Image, Input, Button } from "antd";
import { UploadOutlined, PlusOutlined, CheckOutlined } from "@ant-design/icons";
import axios from "axios";
import "./cart.scss";

const Cart = () => {
  const [cartData, setCartData] = useState([]);
  const [totalPrce, setTotalPrice] = useState();
  const [CourierServiceSelect, setCourierServiceSelect] = useState("");
  const [districSelect, setdistricSelect] = useState("");
  const [courierServiceEdit, setcourierServiceEdit] = useState([]);
  const [LoadCourierService, setLoadCourierService] = useState([]);
  
  const fetchApi = async () => {
    const result = await axios.get("http://localhost:5000/addToCart");
    var tt = 0.0;
    setCartData(result ? result.data : []);
    for (var xx = 0; xx < result.data.length; xx++) {
      tt += result.data[xx].Price;
    }
    setTotalPrice(tt);
  };

  useEffect(() => {
    fetchApi();
    getcur();
  }, []);

  const removeElement = async (id) => {
    const result = await axios.delete(`http://localhost:5000/addToCart/${id}`);
  };

  const onChangeSelectHandler = (e) => {
    setCourierServiceSelect(e.target.value);
    getFrechApi(e.target.value);
  };
  const onChangeSelectDeistricHandler = (e) => {
    setCourierServiceSelect(e.target.value);
    let pr = totalPrce + Number(e.target.value);
    debugger;
    setTotalPrice(pr);
    // getFrechApi( e.target.value)
  };

  const getFrechApi = async (id) => {
    debugger;
    const url = `http://localhost:5000/Admin/courierserviceresult/${id}`;
    const result = await axios.get(url);

    setcourierServiceEdit(result ? result.data : []);
  };

  const getcur = async () => {
    const result = await axios.get(
      "http://localhost:5000/Admin/courierservicename"
    );

    setLoadCourierService(result ? result.data : []);
  };

  const createOrder = async () => {
    const url = `http://localhost:5000/Admin/invoice`;
    const result = await axios.post(
      url,

      {
        invoiceNo: "1",
        TotalAmount: totalPrce,
        Date: new Date(),
        paymentStatus: "unpaid",
      }
    );
    debugger;
  };

  return (
    <div className="container cart-wrapper">
      <div class="row table-wrapper-scroll-y my-custom-scrollbar">
        <table class="table table-bordered table-striped mb-0">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Photo</th>
              <th scope="col">Size</th>
              <th scope="col">Unit Price</th>
              <th scope="col">Qty</th>
              <th scope="col">Total Amount</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {cartData.length > 0 &&
              cartData.map((element, index) => (
                <tr>
                  <th scope="row">{index + 1}</th>
                  <td>
                    <Image width={100} src={element.photoURL} />
                  </td>
                  <td>{element.categoryName}</td>
                  <td>{element.unitPrice}</td>
                  <td>{element.qty}</td>
                  <td>{element.Price}</td>
                  <td>
                    <Button
                      type="primary"
                      shape="round"
                      onClick={() => removeElement(element._id)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="row  btn-group  d-flex" style={{ padding: 50 }}>
        <div className="col-md-6">
          <div className="row ">
            <Button type="Default" icon={<PlusOutlined />}>
              Add More Photos
            </Button>
          </div>
          <div className="row  ">
            <Button type="Default" icon={<UploadOutlined />} danger>
              Upload More Photos
            </Button>
          </div>
          <div className="row btn-group  ">
            <label>Sub Total</label>
            <h2>
              <span>{totalPrce}</span>
            </h2>
          </div>
          <div className="form-group">
            <label>Courier Service Name</label>
            <select
              className="form-control"
              value={CourierServiceSelect}
              onChange={onChangeSelectHandler}
            >
              {LoadCourierService.length > 0 &&
                LoadCourierService.map((element, index) => (
                  <option value={element} key={index}>
                    {element}
                  </option>
                ))}
            </select>
            <select
              className="form-control"
              value={districSelect}
              onChange={onChangeSelectDeistricHandler}
            >
              {courierServiceEdit.length > 0 &&
                courierServiceEdit.map((element, index) => (
                  <option value={element.value} key={index}>
                    {element.districtName + " "}
                    {element.value}
                  </option>
                ))}
            </select>
          </div>
          <div className="row">
            <Button type="danger" onClick={createOrder}>
              Create Invoice
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
