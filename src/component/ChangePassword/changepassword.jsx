import React, { Component } from "react";
import { Link } from "react-router-dom";
import eyeimg from "../../assets/images/arrow-btn.svg";

// form, fields, validation, schemas
import { Button, FormGroup, label } from "react-bootstrap";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import AXIOS from "axios";
import Swal from "sweetalert2";
import Header from "../Common/Header";
import ModalLoader from "../Loader/loader";
import Layout from "../Layout/layout";

const validateLogin = Yup.object().shape({
  oldpassword: Yup.string()
    .required("Please enter Old Password")
    .min(4, "Password must be at least 4 characters")
    .max(12, "Password can be of maximum 12 characters"),

  newpassword: Yup.string()
    .required("Please enter New Password")
    .min(4, "Password must be at least 4 characters")
    .max(12, "Password can be of maximum 12 characters"),

  confirmpassword: Yup.string()
    .required("Please enter Confirm Password")
    .min(4, "Password must be at least 4 characters")
    .max(12, "Password can be of maximum 12 characters")
    .test("equal", "Password mismatch", function(v) {
      const ref = Yup.ref("newpassword");
      return v == this.resolve(ref);
    }),
});

class ChangePassword extends Component {
  state = {};

  handleSubmitEvent = (values, action) => {
    this.setState({
      isLoading: true,
    });
    const accessToken = localStorage.getItem("access_token");
    const instanceAxios = AXIOS.create({
      baseURL: process.env.REACT_APP_API_URL,
    });
    instanceAxios.interceptors.request.use(
      (config) => {
        // Insert authorization token on request call
        config.headers["Authorization"] = `Bearer ${accessToken}`;
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
      oldPassword: values.oldpassword,
      newPassword: values.newpassword,
      confirmPassword: values.confirmpassword
    };

    instanceAxios.post("/api/auth/doctor-app/change-password", postingPram)
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            isLoading: false,
          });
          Swal.fire(res.data.message);
          this.props.history.push("/receivable");
        }
      })
      .catch((err) => {
        this.setState({
          isLoading: false,
        });
        if (err && err.data) {
          Swal.fire(err.data.message);
        } else {
          Swal.fire("Password update Failed");
        }
      });
  };

  render() {
    const newInitialValues = {
      oldpassword: "",
      newpassword: "",
      confirmpassword: "",
    };
    return (
      <Layout>
        <div className="content-wrapper">
          <div className="box-area changePasswordBg">
            <Formik
              initialValues={newInitialValues}
              validationSchema={validateLogin}
              onSubmit={this.handleSubmitEvent}
            >
              {({ errors, touched, isValid, setFieldTouched, handleChange }) => {
                return (
                  <Form>
                    <div className="changePasswordSec">
                      <h2>Change Password</h2>
                      {/* <p>Enter Old , New  and Confirm Password.</p> */}
                      <div
                        className={
                          errors.oldpassword && touched.oldpassword
                            ? "form-group has-feedback"
                            : "form-group"
                        }
                      >
                        <FormGroup controlId="email">
                          {/* <label>Old Password</label> */}
                          <Field
                            name="oldpassword"
                            type="password"
                            className={`form-control`}
                            autoComplete="off"
                            placeholder="Old Password"
                          />
                          {errors.oldpassword && touched.oldpassword ? (
                            <span className="errorMsg" style={{ display: "block", marginLeft: '25px' }}>
                              {errors.oldpassword}
                            </span>
                          ) : null}
                        </FormGroup>
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
                            <span className="errorMsg" style={{ display: "block", marginLeft: '25px' }}>
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
                            placeholder="Confirm Password"
                            // autoComplete="off"
                            onChange={e => {
                                setFieldTouched('confirmpassword');
                                handleChange(e);
                            }}
                          />
                          {errors.confirmpassword && touched.confirmpassword ? (
                            <span className="errorMsg" style={{ display: "block", marginLeft: '25px' }}>
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
                        <Link to="/login" className="btn cancelBtn" style={{ background: '#FFFFFF' }}>Cancel</Link>
                      </div>
                      {/* <div className="forgot-password text-center resend">
                        <Link to="/login" style={{ fontSize: "18px"}}>Cancel</Link>
                      </div> */}
                    </div>
                  </Form>
                );
              }}
            </Formik>
            {/* </div> */}
            {this.state.isLoading && <ModalLoader />}
          {/* </div> */}
          </div>
        </div>
      </Layout>
    );
  }
}

export default ChangePassword;