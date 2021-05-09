import React from "react";
import { Input } from "antd";
import { Button } from "antd";
import { Image } from "antd";

export default function ViewProduct() {
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
                    <label>Image Size</label> <br/>
                    <select id="Change_Courier_Service_Id" clasename="form-control" name="ImageSize">
                    <option value="1">Express</option>
                    <option value="2">Stranded</option>
                    </select>
                </div>
                <div className="form-group"> 
                    <label>Quentity</label>
                    <Input type="number" value="1" min="1" max="1000" step="10"/>
                </div>
                <div className="form-group">
                    <label>Price</label> <br/>
                    <h2>
                    <span>500.00</span>
                    </h2>
                </div>
                <Button type="primary">Add to Cart</Button>
            </div>
        </div>
    </div>
  );
}
