import React, { useState,useEffect } from "react";
import { Table, Input, Button, Space } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import axios from 'axios'
import "./UserProfile.scss"
const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
  },
  {
    key: "2",
    name: "Joe Black",
    age: 42,
    address: "London No. 1 Lake Park",
  },
  {
    key: "3",
    name: "Jim Green",
    age: 32,
    address: "Sidney No. 1 Lake Park",
  },
  {
    key: "4",
    name: "Jim Red",
    age: 32,
    address: "London No. 2 Lake Park",
  },
];
export default function UserProfile() {   
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [userData, setUserData] = useState([]);
  const fetchApi = async () => {
    const result = await axios.get(
      "http://localhost:5000/users"
     
    )
    
    setUserData(result && result.data ? result.data.users : [])
  }
  useEffect( () => {
    fetchApi()
    
  }, []);
  const supendUser = async(id,status)=>{
    debugger
    const url=`http://localhost:5000/Admin/category/${id}`
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
      title: "Name",
      dataIndex: "firstName",
      key: "firstName",
      width: "20%",
      ...getColumnSearchProps("firstName"),
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
      width: "20%",
      ...getColumnSearchProps("lastName"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "20%",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: "20%",
      ...getColumnSearchProps("phoneNumber"),
    },
    ,
    {
      title: "",
      dataIndex: '_id',
    key: '_id',
    width: "20%",
    render: (value,d) => <div> {(d.isActive) ? <Button type="danger" onClick={()=>supendUser(d._id,false)}>Suspend</Button>: <Button type="danger" onClick={()=>supendUser(d._id,true)}>Active</Button>} <Button type="primary" onClick={()=>supendUser(d._id)}>Edit</Button></div>,
    },
  ];
  return (
    <div className="container user-wrapper">
      <div className="panel panel-default">
        <div className="panel-heading">User Profile</div>
        <div className="panel-body">
          {userData.length && <Table columns={columns} dataSource={userData} />}
          
        </div>
      </div>
    </div>
  );
}
