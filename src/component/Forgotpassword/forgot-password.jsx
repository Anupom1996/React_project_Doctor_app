import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import eyeimg from "../../assets/images/arrow-btn.svg";
import eyecrossimg from "../../assets/images/icon-01.svg";
import logoImage from "../../assets/images/SvaasLogo-Login.svg";
// form, fields, validation, schemas
import { Button, FormGroup, label } from "react-bootstrap";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import AXIOS from "axios";
import Swal from "sweetalert2";
import ModalLoader from "../Loader/loader";

class Forgotpassword extends Component {
  state = {
    billBtnPress: false,
    userParam: "",
    searchBy: ""
  };

  handleNewBillPress = () => {
    if (this.state.searchBy === "") {
      Swal.fire("Choose either Mobile Number or Email ID");
    } else {
      this.setState({ billBtnPress: !this.state.billBtnPress });
    }
  }

  handleReturnPress = () => {
    this.setState({ billBtnPress: !this.state.billBtnPress, searchBy: "" });
  }

  handleSubmitEvent = (values, action) => {
    this.setState({
      isLoading: true,
    });
    const instanceAxios = AXIOS.create({
      baseURL: process.env.REACT_APP_API_URL,
    });
    instanceAxios.interceptors.request.use(
      (config) => {
        config.headers[
          "Authorization"
        ] = `Basic c3ByaW5nLXNlY3VyaXR5LW9hdXRoMi1yZWFkLXdyaXRlLWNsaWVudDpzcHJpbmctc2VjdXJpdHktb2F1dGgyLXJlYWQtd3JpdGUtY2xpZW50LXBhc3N3b3JkMTIzNA==`;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    instanceAxios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        return Promise.reject(error.response);
      }
    );

    const postingPram = values.username;

    console.log("POSTING ----->>>> ", postingPram);

    instanceAxios.get("/api/auth/doctor-app/forgot-password-send-otp?userName=" + postingPram)
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            isLoading: false,
          });
          // Swal.fire(res.data.message);
          Swal.fire("OTP has been sent on your registered Email id / Mobile No");
          localStorage.setItem("USER_ID", postingPram);
          this.props.history.push({
            pathname: "/otp",
          });
        }
      })
      .catch((err) => {
        this.setState({
          isLoading: false,
        });
        if (err && err.data) {
          Swal.fire(err.data.message);
        } else {
          Swal.fire("Failed");
        }
      });
  }

  selectNumber = (value) => {
    this.setState({
      searchBy: (value === 1) ? "Mobile Number" : "Email ID"
    })
  }

  render() {
    let refresh_token = localStorage.getItem("refresh_token");
    let access_token = localStorage.getItem("access_token");
    if (access_token !== null && access_token !== "" && refresh_token !== null) {
      return <Redirect to="/receivables" />;
    }

    let validateLogin = "";
    if (this.state.searchBy && this.state.searchBy === "Mobile Number") {
      validateLogin = Yup.object().shape({
        username: Yup.string().required("Please enter registered Mobile Number").matches(/^[0-9]+$/, 'Mobile Number must be numeric').matches(/^[0-9]{10}$/, 'Mobile Number must be 10 digits'),
      });
    } else {
      validateLogin = Yup.object().shape({
        username: Yup.string().required("Please enter registered Email Id").email("Please enter a valid email address"),
      });
    }

    let placeHold = "Enter registered "+this.state.searchBy;

    const newInitialValues = {
      username: "",
    };
    return (
      <>
            <div className="daashboard-bg">
            <div className="Newlogin-box">
        <Formik
          initialValues={newInitialValues}
          validationSchema={validateLogin}
          onSubmit={this.handleSubmitEvent}
        >
          {({ errors, touched, isValid, values }) => {
            return (
              <Form>
                
                <div className="login-box-body">

                <div className="loginLogo">
                <Link to="/" className="logo" onClick={(event)=>{event.preventDefault();}}>
                <span className="logo-lg">
                <img src={logoImage} alt="Svaas" />
                </span>
                </Link>
                </div>

                    {!this.state.billBtnPress && (
                      <div className="">
                      <div className="first-step">
                        {/* <img src={eyecrossimg} alt="Svaas" /> */}
                        <h2>Reset Password with :</h2>
                        <div className="con-toolbar form-group">
                          <div className="form-check">
                            <label className="form-check-label">
                              <input className="form-check-input" type="radio" value="phonenumber" name="choice" onChange={() => this.selectNumber(1)} />
                              <span className="checkmark"></span>
                              Mobile Number</label>
                          </div>
                          <div className="form-check">
                            <label className="form-check-label">
                              <input className="form-check-input" type="radio" value="emailId" name="choice" onChange={() => this.selectNumber(2)} />
                              <span className="checkmark"></span>
                              Email ID</label>
                          </div>
                        </div>
                        <div role="toolbar" className="btn-toolbar">
                          <Button
                            type="submit"
                            variant="success"
                            onClick={() => this.handleNewBillPress()}
                            disabled={!this.state.searchBy || this.state.searchBy === "" ? true : false}
                          >
                            Proceed
                          </Button>
                          <Link to="/login" className="btn CancelBtn">Cancel</Link>
                        </div>
                        {/* <div className="forgot-password text-center resend" style={{ marginTop: "5px" }}>
                         
                        </div> */}
                      </div>
                      </div>
                    )}
                    {this.state.billBtnPress && (
                    <div className="second-step">
                      <h2>Forgot Password</h2>
                      {/* <p>Confirm your {this.state.searchBy} and we'll send the instructions.</p> */}
                      {/* <p>You will receive an OTP on your registered Email Id/ Mobile no.</p> */}
                      <div
                        className={
                          errors.username && touched.username
                            ? "form-group has-feedback"
                            : "form-group"
                        }
                      >
                        <FormGroup controlId="username">
                          {/* <label>Enter registered {this.state.searchBy}</label> */}
                          <Field
                            name="username"
                            type="text"
                            className={`form-control`}
                            autoComplete="off"
                            placeholder={placeHold}
                          />
                          {errors.username && touched.username ? (
                            <span className="errorMsg" style={{ display: "block" }}>
                              {errors.username}
                            </span>
                          ) : null}
                        </FormGroup>
                      </div>
                      <div role="toolbar" className="btn-toolbar">
                        <Button
                          type="submit"
                          variant="success"
                          disabled={isValid && values.username !== '' ? false : true}
                        >
                          Proceed
                        </Button>
                        <span className="btn CancelBtn" onClick={() => {
                            errors.username = "";
                            this.handleReturnPress();
                          }
                        }>Cancel</span>
                      </div>
                      {/* <div className="forgot-password text-center resend" style={{ marginTop: "5px" }}>
                        
                      </div> */}
                      {/* <div className="forgot-password text-center resend">
                        <Link to="/login">Resend Email</Link>
                      </div> */}
                    </div>
                    )}
                </div>
              </Form>
            );
          }}
        </Formik>
        {this.state.isLoading && <ModalLoader />}
        </div>
        </div>
      </>
    );
  }
}

export default Forgotpassword;
