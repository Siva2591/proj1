import React, { useState } from "react";
import { Tabs } from "antd";
import EmailServer from "./EmailServer";
import ERTServer from "./ERPServer";
import Layout from "../components/Layout";
const { TabPane } = Tabs;

function Settings() {
  const [activeTab, setActiveTab] = useState("1");

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <Layout>
      <div style={{ width: "100%" }}>
        <h1>Admin Settings</h1>
        <Tabs
          defaultActiveKey="1"
          centered
          activeKey={activeTab}
          onChange={handleTabChange}
        >
          <TabPane tab="Email Server" key="1">
            <EmailServer />
          </TabPane>
          <TabPane tab="ERP Server" key="2">
            <ERTServer />
          </TabPane>
        </Tabs>
      </div>
      {/* </div> */}
    </Layout>
  );
}

export default Settings;
