import React from "react";
import { Modal } from "react-bootstrap";
import whitelogo from "../../assets/images/drreddylogo_white.png";

const modalComponent = (props) => {
  return (
    <div
      style={{
        flex: 1,
        position: "fixed",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        top: 0,
        left: 0,
        zIndex: 1,
      }}
    >
      <div className="loading_reddy_outer">
        <img src={whitelogo} alt="logo" />
      </div>
    </div>
  );
};

export default modalComponent;
