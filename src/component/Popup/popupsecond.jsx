import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, FormGroup, label, Modal } from "react-bootstrap";
import icon02 from "../../assets/images/icon-02.svg";
import { Formik, Field, Form } from "formik";

class Popupsecond extends Component {
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
              <img src={icon02} alt="Dr Reddys" />
            </div>
            <div className="modal-body-area total-amount-area">
              <h5 style={{fontWeight: "bold"}}>Payable by Customer: <span>&#8377;</span>{this.props.totalPay}
              </h5>
              <br />
              <p style={{fontWeight: "bold"}}>Total Amount: <span>&#8377;</span>{this.props.totalAmount}
              </p>
              <p style={{fontWeight: "bold"}}>Payable by Insurance: <span>&#8377;</span>{this.props.insrAmount}
              </p>
              <br />
            </div>
            <div className="table-button-area">
              <div className="btn-col-1">
                <Button variant="warning" onClick={this.handelClose}>
                  Cancel Order
                </Button>
              </div>
              <div className="btn-col-1">
                <Button variant="success" onClick={this.handelSave}>
                  Collect Payment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Popupsecond;
