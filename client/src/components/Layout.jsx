import React from "react";
import Sidebar from "./Sidebar";
import bg from "../assets/bg.jpeg";

const Layout = ({ children }) => {
  return (
    <div style={{ display: "flex", height: "100%", overflow: "clip" }}>
      <Sidebar />
      <div style={{ boxSizing: "border-box", width: "100%" }}>
        <div
          style={{
            background: `url(${bg})`, // Apply background image
            backgroundSize: "cover", // Adjust as needed
            backgroundPosition: "center center", // Adjust as needed
            position: "sticky",
            boxSizing: "border-box",
            margin: "1%",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
