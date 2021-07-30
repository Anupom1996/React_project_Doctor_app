import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, FormGroup, label, Modal } from "react-bootstrap";
import icononetimepassword from "../../assets/images/icon-one-time-password.svg";
import OtpInput from "react-otp-input";
import { Formik, Field, Form } from "formik";

class Popupthird extends Component {
  state = { otp: "", timer: 30 };

  handleChange = (otp) => this.setState({ otp });

  componentDidMount() {
    let interVal = setInterval(() => {
      if (this.state.timer == 0) {
        clearInterval(interVal);
      } else {
        this.setState({
          timer: this.state.timer - 1,
        });
      }
    }, 1000);
  }

  render() {
    return (
      <>
        <div className="counter-bg"></div>
        <div className="container">
          <div className="counter-modal cusin-modal">
            <div className="modal-top-area">
              <img src={icononetimepassword} alt="Dr Reddys" />
            </div>
            <div className="modal-body-area otp-amount-area">
              <p>Enter OTP sent to {this.props.mobileNo}</p>
              <div className="otp-cusin-group">
                <OtpInput
                  value={this.state.otp}
                  onChange={this.handleChange}
                  numInputs={6}
                  separator={<span>-</span>}
                />
              </div>
              <span className="errorMsg" style={{ display: "block" }}></span>
              {this.state.timer > 0 ? (
                <p className="timeMsg">
                  {/* Enter number within <span>0:{this.state.timer}</span> sec. */}
                  Resend OTP option in <span>0:{this.state.timer}</span> sec
                </p>
              ) : (
                <Button
                  className="checkbox-text"
                  onClick={() => this.props.resendOTP()}
                >
                  Resend OTP
                </Button>
              )}
            </div>
            <div className="table-button-area justify-content-center">
              <div className="btn-col-1">
                <Button variant="warning" onClick={() => this.props.onClose()}>
                  Cancel
                </Button>
              </div>
              <div className="btn-col-1">
                <Button
                  variant="success"
                  onClick={() => this.props.onClose(this.state.otp)}
                >
                  Confirmed
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Popupthird;
