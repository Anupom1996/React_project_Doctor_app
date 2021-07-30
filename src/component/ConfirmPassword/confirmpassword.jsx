import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import eyeimg from "../../assets/images/arrow-btn.svg";

// form, fields, validation, schemas
import { Button, FormGroup, label } from "react-bootstrap";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import AXIOS from "axios";
import Swal from "sweetalert2";
import ModalLoader from "../Loader/loader";
import logoImage from "../../assets/images/SvaasLogo-Login.svg"; 

const validateLogin = Yup.object().shape({
  newpassword: Yup.string()
    .required("Please enter New Password")
    .min(4, "Password must be at least 4 characters")
    .max(12, "Password maximum 12 characters"),

  confirmpassword: Yup.string()
    .required("Please enter Confirm Password")
    .min(4, "Password must be at least 4 characters")
    .max(12, "Password maximum 12 characters")
    .test("equal", "Password mismatch", function(v) {
      const ref = Yup.ref("newpassword");
      return v == this.resolve(ref);
    }),
});

class ConfirmPassword extends Component {
  state = {};

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

    const postingPram = {
      newPassword: values.newpassword,
      confirmPassword: values.confirmpassword,
      // otp: localStorage.getItem("OTP_ID"),
      userName: localStorage.getItem("USER_ID"),
    };

    instanceAxios.post("/api/auth/doctor-app/forgot-password-verify-otp-set-new-password", postingPram)
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            isLoading: false,
          });
          console.log("RESPONSE ----->>>> ", res);
          Swal.fire(res.data.message);
          this.props.history.push("/login");
        }
      })
      .catch((err) => {
        this.setState({
          isLoading: false,
        });
        console.log("Error in =======>>>>> ", JSON.stringify(err));
        if (err && err.data) {
          Swal.fire(err.data.message);
        } else {
          Swal.fire("Failed");
        }
      });
  };

  render() {
    let refresh_token = localStorage.getItem("refresh_token");
    let access_token = localStorage.getItem("access_token");
    if (access_token !== null && access_token !== "" && refresh_token !== null) {
      return <Redirect to="/receivables" />;
    }
    let otpId = localStorage.getItem("OTP_ID");
    let userId = localStorage.getItem("USER_ID");
    console.log(otpId, userId)
    if (otpId === null || otpId === "" || userId === null) {
      return <Redirect to="/login" />;
    }

    const newInitialValues = {
      newpassword: "",
      confirmpassword: "",
    };
    return (
      <>
        {/* <div className="back-button">
          <Link to="/login">
            <img src={eyeimg} alt="Dr Reddys" /> <span>Back</span>
          </Link>
        </div> */}
        <div className="daashboard-bg">
        <div className="Newlogin-box">
        <Formik
          initialValues={newInitialValues}
          validationSchema={validateLogin}
          onSubmit={this.handleSubmitEvent}
        >
          {({ errors, touched, isValid, setFieldTouched, handleChange }) => {
            return (
              <Form>
           
                <div className="login-box-body">
                <div className="loginLogo">
                  <Link to="/" className="logo" onClick={(event)=>{event.preventDefault();}}>
                    <span className="logo-lg">
                      <img src={logoImage} alt="Dr.Reddy's" />
                    </span>
                  </Link>
                </div>
                  <h2>Reset Password</h2>
                  {/* <p>Enter New Password and Confirm Password.</p> */}
                  <div className="form-group resetInfo">
                  <ul>
                    <li>
                      Password should be at least 4 charecters long
                    </li>
                    <li>
                      Password should have at least 1 Lower case letter, 1 Upper case letter, 1 Special Character and 1 digit 
                    </li>
                  </ul>
                  </div>
                  <div
                    className={
                      errors.newpassword && touched.newpassword
                        ? "form-group has-feedback"
                        : "form-group"
                    }
                  >
                    <FormGroup controlId="email">
                      {/* <label>New Password</label> */}
                      <Field
                        name="newpassword"
                        type="password"
                        className={`form-control`}
                        autoComplete="off"
                        placeholder="New Password"
                      />
                      {errors.newpassword && touched.newpassword ? (
                        <span className="errorMsg" style={{ display: "block" }}>
                          {errors.newpassword}
                        </span>
                      ) : null}
                    </FormGroup>
                  </div>
                  <div
                    className={
                      errors.confirmpassword && touched.confirmpassword
                        ? "form-group has-feedback"
                        : "form-group"
                    }
                  >
                    <FormGroup controlId="email">
                      {/* <label>Confirm Password</label> */}
                      <Field
                        name="confirmpassword"
                        type="password"
                        className={`form-control`}
                        autoComplete="off"
                        placeholder="Confirm Password"
                        onChange={e => {
                          setFieldTouched('confirmpassword');
                          handleChange(e);
                        }}
                      />
                      {errors.confirmpassword && touched.confirmpassword ? (
                        <span className="errorMsg" style={{ display: "block" }}>
                          {errors.confirmpassword}
                        </span>
                      ) : null}
                    </FormGroup>
                  </div>
                  <div role="toolbar" className="btn-toolbar">
                    <Button
                      type="submit"
                      variant="success"
                      disabled={isValid ? false : true}
                    >
                      Submit
                    </Button>
                    <Link to="/login"  className="btn cancelBtn cancelOutline" >Cancel</Link>
                  </div>
                  {/* <div className="forgot-password text-center resend">
                    <Link to="/login" style={{ fontSize: "18px"}}>Cancel</Link>
                  </div> */}
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

export default ConfirmPassword;