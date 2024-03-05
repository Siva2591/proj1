import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import thinkAI from "../assets/thinkAI.png";
import {
  HomeOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Modal } from "antd";
import thinkAIlogo from "../assets/thinkAIlogo.png";
const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebarCollapsed") === "true" || false
  );
  const location = useLocation();

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = () => {
    // Clear login status or perform any other logout logic
    localStorage.removeItem("isLogin");

    // Close the modal
    setLogoutModalVisible(false);

    navigate("/");
  };

  const cancelLogout = () => {
    // Close the modal without logging out
    setLogoutModalVisible(false);
  };

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", collapsed);
  }, [collapsed]);

  const menuItems = [
    { key: "1", icon: <HomeOutlined />, label: "Home", link: "/home" },
    {
      key: "2",
      icon: <ClockCircleOutlined />,
      label: "TLprocess",
      link: "/tlprocess",
    },
    {
      key: "3",
      icon: <SettingOutlined />,
      label: "Settings",
      link: "/settings",
    },
    {
      key: "4",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          style={{ backgroundColor: "#E1B6E6" }}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          {!collapsed && (
            <div
              className="logo"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <img
                src={thinkAI}
                alt="Logo"
                style={{ width: "130px", height: "40px", marginTop: "20px" }}
              />
            </div>
          )}
          {collapsed && (
            <div
              className="logo"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <img
                src={thinkAIlogo}
                alt="Logo"
                style={{ width: "45px", height: "40px", marginTop: "20px" }}
              />
            </div>
          )}

          <br />
          <Menu
            theme="#ffd6e7"
            defaultSelectedKeys={["1"]}
            mode="inline"
            style={{ margin: "10px" }}
          >
            {menuItems.map(({ key, icon, label, link, onClick }) => (
              <Menu.Item
                key={key}
                icon={icon}
                onClick={onClick}
                style={{
                  width: "80%",
                  backgroundColor:
                    location.pathname === link ? "white" : "transparent",
                }}
              >
                <Link
                  to={link}
                  style={{ color: collapsed ? "white" : "inherit" }}
                >
                  {label}
                </Link>
              </Menu.Item>
            ))}
          </Menu>

          {/* Logout Confirmation Modal */}
          <Modal
            title="Logout Confirmation"
            visible={logoutModalVisible}
            onOk={confirmLogout}
            onCancel={cancelLogout}
            cancelButtonProps={{ style: { color: "red" } }}
          >
            <p>Are you sure you want to logout?</p>
          </Modal>
        </Sider>

        <Layout>
          <div
            style={{
              padding: 16,
              textAlign: collapsed ? "center" : "right",
              color: collapsed ? "black" : "inherit",
            }}
          >
            {/* Additional content in the layout if needed */}
          </div>
        </Layout>
      </Layout>
    </>
  );
};

export default Sidebar;
