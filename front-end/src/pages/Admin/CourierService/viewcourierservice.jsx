import React, { useState, useEffect } from "react";
import { Input, Button,Modal,Popconfirm } from "antd";
import { CategoryValues, CategoryTypes } from "./extranalData";
import CustomTextBox from "../Shared/commonTextBox/CustomTextBox";
import axios from "axios";

export default function ViewCourierService() {
//   const [category, setCategory] = useState(CategoryValues);
   const [courierServiceEdit, setcourierServiceEdit] = useState([]);
  const [CourierServiceSelect, setCourierServiceSelect] = useState("");
//   const [loading, setLoading] = useState(false);
  const [LoadCourierService, setLoadCourierService] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [messagelog,setMessage]=useState("");
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
//   const onChangeHandler = (type) => (e) => {
//     setCategory({
//       ...category,
//       [type]: e.target.value,
//     });
//   };
  const onChangeSelectHandler =  (e) => {
    debugger
    setCourierServiceSelect( e.target.value,
    );
    getFrechApi( e.target.value)
  };
  const onChangeEditHandler = (type) => (e) => {
    setcourierServiceEdit(e.target.value
    );
  };
const getFrechApi = async(id) =>{
  debugger
  const url=`http://localhost:5000/Admin/courierserviceresult/${id}`
  const result = await axios.get(url);
  
  setcourierServiceEdit(result ? result.data : []);
}

  const fetchApi = async () => {
    const result = await axios.get("http://localhost:5000/Admin/courierservicename");

    setLoadCourierService(result ? result.data : []);
  };
  useEffect(() => {
    fetchApi();
  }, []);
  const onChangeInputHandler = (id, price) => {
    courierServiceEdit.map((x, i) => {
      if (x.id == id) {
        x.value = price;
      }

      setcourierServiceEdit([...courierServiceEdit]);
    });
  };
  const editCourierService = async () =>{
      debugger
    const url=`http://localhost:5000/Admin/courierservice/${CourierServiceSelect}`
    const result = await axios.put(
      url,
    
      courierServiceEdit
    );
    if (result.status==200) {
        setMessage("data Update Successfully")
       
        showModal();
        
      }
      else if(result.status==400){
        setMessage(result.data.message)
       
        showModal();
      }

  }
//   const addCategory = async () => {
//     setLoading(true);
//     const result = await axios.post(
//       "http://localhost:5000/Admin/category",
//       category
//     );
//     if (result && result.data) {
//       setLoading(false);
//     } else {
//       setLoading(false);
//     }
//   };
//   const putCategory = async () => {
//     debugger
//     const url=`http://localhost:5000/Admin/category/${CourierServiceSelect}`
//     const result = await axios.put(
//       url,
    
//       {"price":courierServiceEdit}
//     );
//     // if (result && result.data) {
//     //   setLoading(false);
//     // } else {
//     //   setLoading(false);
//     // }
//   };
function confirm(e) {
    deleteCourierService()
  }
  
  function cancel(e) {
   
  }
  const focusHandler= (id, price) => {
      
    courierServiceEdit.map((x, i) => {
      if (x.id == id) {
        debugger
        if(x.value == "0.00")
        {
          x.value = ""
        }
        // x.value = price;
      }
  
      setcourierServiceEdit([...courierServiceEdit]);
    });
  };
  const focusOutHandler =(id, price) => {
      debugger
    courierServiceEdit.map((x, i) => {
      if (x.id == id) {
        if(x.value == "")
        {
          x.value = "0.00"
        }
      }
  
      setcourierServiceEdit([...courierServiceEdit]);
    });
  };
  const deleteCourierService = async () => {
    debugger
    const url=`http://localhost:5000/Admin/courierservice/${CourierServiceSelect}`
    const result = await axios.delete(
      url
    );
    // if (result && result.data) {
    //   setLoading(false);
    // } else {
    //   setLoading(false);
    // }
  };

  return (
    <div className="container">
      <div className="row">

        <div className="col-md-12">
          <div className="card card-primary">
            <div className="card-header">
              <h3 className="card-title">View Courier Service</h3>
            </div>
            <div className="card-body">
 <div className="col-md-4"></div>
 <div className="col-md-4">
                  <div className="form-group">
                <label>Courier Service Name</label>
                <select className="form-control" value={CourierServiceSelect} onChange={onChangeSelectHandler}>
                  
                  {LoadCourierService.length > 0 &&
                    LoadCourierService.map((element, index) => (
                      <option value={element} key={index}>
                        {element}
                      </option>
                    ))}
                </select>
              </div>
              <Popconfirm
    title="Are you sure to delete this task?"
    onConfirm={confirm}
    onCancel={cancel}
    okText="Yes"
    cancelText="No"
  >
              <Button type="danger" >
                Delete
              </Button>
              </Popconfirm>
 </div>
 <div className="col-md-4"></div>

{/* 
              <Button type="primary" onClick={putCourier Service}>
                Edit
              </Button>
              <Button type="danger" onClick={deleteCategory}>
                Delete
              </Button> */}
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        {courierServiceEdit.length > 0 &&
          courierServiceEdit.map((data,i) => (
            <div className="col-md-4">
              <CustomTextBox obj={data} func={onChangeInputHandler} keyvalue={i} onBlur={focusOutHandler} onFocus={focusHandler}/>
            </div>
          ))}
          <div className="col-12">
          <Button type="primary" onClick={editCourierService}>Edit Courier Service</Button>
          </div>
      </div>
      <Modal
                title="Basic Modal"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
              >
               {messagelog}
              </Modal>
    </div>
  );
}
