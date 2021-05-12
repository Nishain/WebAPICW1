import React from "react";
import { Image } from "antd";
import { Input } from "antd";
import { Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import { CheckOutlined} from "@ant-design/icons";
import "./cart.scss";

const Cart =() => {
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
            <tr>
              <th scope="row">1</th>
              <td>
                <Image
                  width={100}
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                />
              </td>
              <td>4(inch) * 4(inch)</td>
              <td>50.00</td>
              <td>
                <Input type="number" value="1" min="1" max="1000" step="10" />
              </td>
              <td>500.00</td>
              <td>
                <Button type="primary" shape="round">
                  Remove
                </Button>
              </td>
            </tr>
            <tr>
              <th scope="row">1</th>
              <td>
                <Image
                  width={100}
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                />
              </td>
              <td>4(inch) * 4(inch)</td>
              <td>50.00</td>
              <td>
                <Input type="number" value="1" min="1" max="1000" step="10" />
              </td>
              <td>500.00</td>
              <td>
                <Button type="primary" shape="round">
                  Remove
                </Button>
              </td>
            </tr>
            <tr>
              <th scope="row">1</th>
              <td>
                <Image
                  width={100}
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                />
              </td>
              <td>4(inch) * 4(inch)</td>
              <td>50.00</td>
              <td>
                <Input type="number" value="1" min="1" max="1000" step="10" />
              </td>
              <td>500.00</td>
              <td>
                <Button type="primary" shape="round">
                  Remove
                </Button>
              </td>
            </tr>
            <tr>
              <th scope="row">1</th>
              <td>
                <Image
                  width={100}
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                />
              </td>
              <td>4(inch) * 4(inch)</td>
              <td>50.00</td>
              <td>
                <Input type="number" value="1" min="1" max="1000" step="10" />
              </td>
              <td>500.00</td>
              <td>
                <Button type="primary" shape="round">
                  Remove
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="row  btn-group  d-flex">
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
                        <h2><span>2500.00</span></h2>
                    </div>
            
                    <div  className="row">
                        <Button type="primary" icon={<CheckOutlined />}>
                        Check Out
                        </Button>
                    </div>
            </div>
      </div>
    </div>
  );
}

export default Cart