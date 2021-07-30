import React, { Component } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { Button, FormGroup, label, Modal } from "react-bootstrap";
import eyecrossimg from "../../assets/images/icon-01.svg";
import icon02 from "../../assets/images/icon-02.svg";
import { Formik, Field, Form } from "formik";

class NotificationPopup extends Component {
  state = {};

  handelClose = () => {
    this.props.onClose();
  };

  render() {
    return (
      <>
        <div className="counter-bg">
          <div className="container">
          <div className="login-box-body">
          <div className="starting-container" style={{height: '350px'}}>
            <div className="first-step">
              <img src={eyecrossimg} alt="Dr Reddys" />
              <h5>{this.props.data.subject}</h5>
              <p className="time">
                Notification Date :  {moment(new Date(this.props.data.createdDate)).format( "DD-MM-YYYY" )}
              </p>
              <div className="con-toolbar">
                <p>
                  {this.props.data.message}
                </p>
              </div>
              <div role="toolbar" className="btn-toolbar">
                  <Button variant="warning" onClick={this.handelClose}>
                    Back
                  </Button>
              </div>
            </div>
          </div>
          </div>
          </div>
        </div>
      </>
    );
  }
}

export default NotificationPopup;
