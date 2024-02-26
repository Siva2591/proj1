import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Checkbox } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { server } from "../constants";
import Layout from "../components/Layout";

const Process = () => {
  console.log(server);
  const [pdfVisible, setPdfVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [poNumber, setPoNumber] = useState("");
  const [myres, setMyres] = useState([]);

  const handleOnSubmit = () => {
    // Your submit logic here
  };
  const onChange = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };

  const onDeleteClick = async (record) => {
    try {
      console.log("process.env:", process.env);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/delete-data/${record._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log("Deleted Successfully");
        const updatedData = myres.filter((item) => item._id !== record._id);
        setMyres(updatedData);
      } else {
        console.error("Error deleting data:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleOnClose = () => {
    setPdfVisible(false);
  };

  const onViewClick = (record) => {
    console.log("onViewClick triggered");
    setSelectedRow(record);
    setPdfVisible(true);
  };

  useEffect(() => {
    console.log(selectedRow);
    if (selectedRow && selectedRow.data) {
      console.log("selectedRow.data in useEffect:", selectedRow.data);
    }
  }, [selectedRow]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data...");
        const response = await fetch(`${server}/api/get-data`);
        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Data received:", data);

        // Check if data.data is an array
        if (Array.isArray(data.data)) {
          // Add a serial number to each data object
          const dataWithSerial = data.data.map((item, index) => ({
            ...item,
            sno: index + 1,
          }));
          // Update component state with fetched data
          setMyres(dataWithSerial);
        } else {
          console.error("Invalid data structure. Expected an array.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { title: "Sno", dataIndex: "sno", key: "sno" },
    { title: "Email_Id", dataIndex: "senderEmail", key: "senderEmail" },
    {
      title: "No. of Attachments",
      dataIndex: "attachmentsCount",
      key: "attachmentsCount",
    },
    {
      title: "Attachment",
      dataIndex: "attachment",
      key: "attachment",
      render: (text, record) => (
        <span>
          {record.attachmentsCount > 0 ? (
            <Checkbox checked disabled />
          ) : (
            "No Attachment"
          )}
        </span>
      ),
    },
    { title: "GR Status", dataIndex: "grStatus", key: "grStatus" },
    { title: "GR No", dataIndex: "grNo", key: "grNo" },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <>
          <Button
            style={{ backgroundColor: "#15f4ee" }}
            onClick={() => {
              onViewClick(record);
            }}
            disabled={record.attachmentsCount === 0}
          >
            View
          </Button>
          <Button
            type="danger"
            style={{ color: "#fd5c63" }}
            onClick={() => onDeleteClick(record)}
          >
            <b>Delete</b>
          </Button>
        </>
      ),
    },
  ];

  const modalFooter = (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
    >
      <Button key="submit" type="primary" onClick={handleOnSubmit}>
        Submit
      </Button>
      <Button
        key="cancel"
        style={{ marginLeft: "10px", color: "red" }}
        onClick={handleOnClose}
      >
        Cancel
      </Button>
    </div>
  );

  return (
    <Layout>
      {/* <div style={{ display: "flex", height: "100vh" }}> */}
      <div style={{ width: "100%", padding: "10px" }}>
        <Table
          columns={columns}
          dataSource={myres}
          pagination={{ pageSize: 8 }}
        />
        <Modal
          title="Details Page"
          width={"70%"}
          style={{ position: "sticky" }}
          footer={modalFooter}
          visible={pdfVisible}
          onCancel={handleOnClose}
          closeIcon={
            <CloseOutlined style={{ fontSize: "20px", color: "#999" }} />
          }
        >
          {pdfVisible && selectedRow ? (
            <div style={{ display: "flex" }}>
              <div>
                <label style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Company Name
                </label>{" "}
                <br />
                <input
                  type="text"
                  value={selectedRow.CompanyName || ""}
                  readOnly
                  style={{ fontSize: "14px", padding: "5px" }}
                />
                <label style={{ fontWeight: "bold", fontSize: "16px" }}>
                  PO_Number
                </label>
                <br />
                <input
                  type="text"
                  value={selectedRow.PO_Number || ""}
                  readOnly
                  style={{ fontSize: "14px", padding: "5px" }}
                />
                <br />
                <label style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Quantity
                </label>
                <br />
                <input
                  type="text"
                  value={selectedRow.Quantity || ""}
                  readOnly
                  style={{ fontSize: "14px", padding: "5px" }}
                />
                <br />
                <label style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Amount
                </label>
                <br />
                <input
                  type="text"
                  value={selectedRow.Amount || ""}
                  readOnly
                  style={{ fontSize: "14px", padding: "5px" }}
                />
              </div>

              <div style={{ padding: "30px" }}>
                <iframe
                  title="PDF Viewer"
                  src={`data:application/pdf;base64,${selectedRow.pdfBuffer}`}
                  width="700px"
                  height="450px"
                />
              </div>
            </div>
          ) : (
            <div>
              {/* Render some placeholder content or an error message */}
              <p>Modal content cannot be displayed. Please check the data.</p>
            </div>
          )}
        </Modal>
      </div>
      {/* </div> */}
    </Layout>
  );
};

export default Process;
