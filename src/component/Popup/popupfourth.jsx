import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, FormGroup, label, Modal } from "react-bootstrap";
import iconaccept from "../../assets/images/icon-accept.svg";
import { Formik, Field, Form } from "formik";

class Popupfourth extends Component {
  state = {
    receiptNo: 0
  }

  componentDidMount = async () => {
    console.log("This Receipt No", this.props.receiptNo);
    await this.setState({
      receiptNo: this.props.receiptNo
    })
  }

  render() {
    return (
      <>
        <div className="counter-bg"></div>
        <div className="container">
          <div className="counter-modal cusin-modal">
            <div className="modal-top-area">
              <img src={iconaccept} alt="Dr Reddys" />
            </div>
            <div className="modal-body-area total-amount-area">
              <div className="first-area">
                <p>Total Paid:</p>
                <p className="total-amount">
                  <span>&#8377;</span> {this.props.totalPay}
                </p>
                <p>Payment received successfully</p>
              </div>
              <hr />
              <div className="second-area">
                <p className="text-center">
                  <strong>Summary</strong>
                </p>
                <div className="row">
                  <div className="col-7">
                    <p>Total Bill Value:</p>
                  </div>
                  <div className="col-5">
                    <p>
                      <span>&#8377;</span> {this.props.totalPay}
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-7">
                    <p>Paid by OPD:</p>
                  </div>
                  <div className="col-5">
                    <p>
                      <span>&#8377;</span> {this.props.paidByOPD}
                    </p>
                  </div>
                </div>
              </div>
              <hr />
              <div className="last-area">
                <p>Ordered Fulfilled Partially</p>
                <p>
                  A copy of the invoice has also been shared to the customer
                </p>
              </div>
            </div>
            {/* <div className="table-button-area justify-content-center">
              <div className="btn-col-1">
                <Button variant="success" onClick={this.props.onClose}>
                  Back to Home
                </Button>
              </div>
            </div> */}
            <div className="table-button-area justify-content-center">
              <div className="btn-col-1">
                <Button variant="warning" onClick={() => {
                  this.props.onClose();
                }}>
                  Back to Home
                </Button>
              </div>
              <div className="btn-col-1">
                <Link to={{ pathname: "/dashboard/" + this.state.receiptNo }} >
                  <Button variant="success" 
                  // onClick={() => {
                  //     window.location.hash = "/dashboard/" + this.props.recieptNo 
                  //   } }
                  >
                    View Receipt
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Popupfourth;
