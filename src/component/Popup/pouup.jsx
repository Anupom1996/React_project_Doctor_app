import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, FormGroup, label, Modal } from "react-bootstrap";
import { Formik, Field, Form } from "formik";
import icon01 from "../../assets/images/icon-01.svg";

class Popup extends Component {
  state = {};

  handelClose = () => {
    this.props.onClose();
  };

  handelSave = () => {
    this.props.onClose(true);
  };

  render() {
    return (
      <>
        <div className="counter-bg"></div>
        <div className="container">
          <div className="counter-modal cusin-modal">
            <div className="modal-top-area">
              <img src={icon01} alt="Dr Reddys" />
              <p>
                You are only partially fulfilling the order from the customer{" "}
              </p>
            </div>
            <hr />
            <div className="modal-body-area">
              <p>Do you want to</p>
            </div>
            <div className="table-button-area">
              <div className="btn-col-1">
                <Button variant="warning" onClick={this.handelClose}>
                  Cancel
                </Button>
              </div>
              <div className="btn-col-1">
                <Button variant="success" onClick={this.handelSave}>
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Popup;
