import React, { useState,useEffect } from "react";
import { Table, Input, Button, Space } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import OrderData from "./OrdersData.json"
import axios from 'axios'
export default function Orders() {   
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [orderData, setorderData] = useState([]);
  const fetchApi = async () => {
    const result = await axios.get(
      "http://localhost:5000/users"
     
    )
    
    // setorderData(result && result.data ? result.data.users : [])
    setorderData(OrderData)
  }
  useEffect( () => {
    fetchApi()
    
  }, []);
  const supendUser = async(id,status)=>{
    debugger
    const url=`http://localhost:5000/users/${id}`
    const result = await axios.put(
      url,
    
      {"isActive":status}
    );
    // if (result && result.data) {
    //   setLoading(false);
    // } else {
    //   setLoading(false);
    // }
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          //   ref={node => {
          //     searchInput = node;
          //   }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        // setTimeout(() => searchInput.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const columns = [
    {
      title: "Invoice Number",
      dataIndex: "invoiceNo",
      key: "invoiceNo",
      width: "20%",
      ...getColumnSearchProps("invoiceNo"),
    },
    {
      title: "Total Amount",
      dataIndex: "TotalAmount",
      key: "TotalAmount",
      width: "20%",
      ...getColumnSearchProps("TotalAmount"),
    },
    {
      title: "Date",
      dataIndex: "Date",
      key: "Date",
      width: "20%",
      ...getColumnSearchProps("Date"),
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      width: "20%",
      ...getColumnSearchProps("paymentStatus"),
    },
    ,
    {
      title: "",
      dataIndex: '_id',
    key: '_id',
    width: "20%",
    render: (value,d) => <div>  <Button type="primary" onClick={()=>supendUser(d._id)}>View Invoice</Button></div>,
    },
  ];
  return (
    <div className="container user-wrapper">
      <div className="panel panel-default">
        <div className="panel-heading">User Profile</div>
        <div className="panel-body">
          {orderData.length && <Table columns={columns} dataSource={orderData} />}
          
        </div>
      </div>
    </div>
  );
}
