import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { Button, FormGroup, label } from "react-bootstrap";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import eyecrossimg from "../../assets/images/view-icon.svg";
import eyeimg from "../../assets/images/view-open.svg";
import Swal from "sweetalert2";
import AXIOS from "axios";
import logoImage from "../../assets/images/SvaasLogo-Login.svg";
import Layout from "../Layout/layout";

const validateLogin = Yup.object().shape({
  username: Yup.string().trim().required("Please enter your username"),
  password: Yup.string().trim()
    .required("Please enter your password")
    .min(4, "Password must be at least 4 characters long"),
});

class Login extends Component {
  state = {
    isLoading: false,
    isShowPassword: false,
  }

  async getDetails() {
    if (localStorage.getItem("isLoggedIn")) {
      const accessToken = localStorage.getItem("access_token");
      const instanceAxios = AXIOS.create({
        baseURL: process.env.REACT_APP_API_URL,
      });
      instanceAxios.interceptors.request.use(
        (config) => {
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
      await instanceAxios
        .get("/doctor-app/view")
        .then((res) => {
          // console.log("Response get-permited-menus =======>>>>> ", res);
          if (res.status === 200) {
            // const userdata = this.state.user;
            let userdata = {};
            userdata.name = res.data.name;
            userdata.qualification = res.data.qualification;
            userdata.specialization = res.data.specialization;
            userdata.profilePicture = res.data.profilePicture;

            // let userBase = atob(JSON.stringify(userdata));
            // console.log("userBase", userBase)
            localStorage.setItem("userdata", JSON.stringify(userdata));
            this.props.history.push("/receivables");
          }
        })
        .catch((err) => {
          console.log("Error in =======>>>>> ", JSON.stringify(err));
          if (err && err.data && err.data.message) {
            Swal.fire(err.data.message);
          } else {
            Swal.fire("Failed to fetch Doctor data");
          }
          localStorage.clear();
          this.props.history.push("/");
        });
    } else {
      console.log("Not logged in ");
      localStorage.clear();
      this.props.history.push("/");
    }
  }

  handleSubmitEvent = (values, action) => {
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
      device_id: "",
      grant_type: "password",
      username: values.username.trim(),
      password: values.password.trim(),
    };

    console.log("POSTING ----->>>> ", postingPram);

    instanceAxios
      .post("/api/auth/doctor-app/signin", postingPram)
      .then((res) => {
        if (res.status === 200) {
          console.log("RESPONSE ----->>>> ", res);

          localStorage.setItem("isLoggedIn", true);
          localStorage.setItem("access_token", res.data.access_token);
          localStorage.setItem("refresh_token", res.data.refresh_token);
          // this.props.history.push("/receivables");
          this.props.history.push("/receivables");
          this.getDetails();
        }
      })
      .catch((err) => {
        console.log("Error in =======>>>>> ", JSON.stringify(err));
        if (err && err.data) {
          Swal.fire(err.data.message);
        } else {
          Swal.fire("Login failed");
        }
      });
  }

  render() {
    let refresh_token = localStorage.getItem("refresh_token");
    let access_token = localStorage.getItem("access_token");
    if (access_token !== null && access_token !== "" && refresh_token !== null) {
      return <Redirect to="/receivables" />;
    }

    const newInitialValues = {
      username: "",
      password: "",
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
                      <img src={logoImage} alt="Dr.Reddy's" />
                    </span>
                  </Link>
                </div>


                  <h2>Login to your account</h2>
                  <div
                    className={
                      errors.username && touched.username
                        ? "form-group has-feedback"
                        : "form-group"
                    }
                  >
                    <FormGroup controlId="username">
                      {/* <label>Username</label> */}
                      <Field
                        name="username"
                        type="text"
                        className={`form-control`}
                        placeholder="Enter registered email id/ mobile no"
                        autoComplete="off"
                      />
                      {errors.username && touched.username ? (
                        <span className="errorMsg" style={{ display: "block" }}>
                          {errors.username}
                        </span>
                      ) : null}
                    </FormGroup>
                  </div>
                  <div
                    className={
                      errors.password && touched.password
                        ? "form-group has-feedback"
                        : "form-group"
                    }
                  >
                    <FormGroup controlId="password">
                      {/* <label>Password</label> */}
                      <Field
                        name="password"
                        type={this.state.isShowPassword ? "text" : "password"}
                        className={`form-control`}
                        //placeholder="Enter password"
                        autoComplete="off"
                      />
                      <div
                        className="form-password"
                        onClick={() =>
                          this.setState({
                            isShowPassword: !this.state.isShowPassword,
                          })
                        }
                      >
                        {this.state.isShowPassword ? (
                          <img src={eyeimg} alt="Dr Reddys" />
                        ) : (
                          <img src={eyecrossimg} alt="Dr Reddys" />
                        )}
                      </div>
                      {errors.password && touched.password ? (
                        <span className="errorMsg" style={{ display: "block" }}>
                          {errors.password}
                        </span>
                      ) : null}
                    </FormGroup>
                  </div>
                  <div className="form-group forgot-password text-right">
                    <Link to="/forgotpassword">Forgot Password?</Link>
                  </div>
                  <div role="toolbar" className="btn-toolbar">
                    <Button
                      type="submit"
                      variant="success"
                      disabled={isValid && values.password !== '' && values.username !== '' ? false : true}
                    >
                      Login
                    </Button>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
        </div>
        </div>
      </>
    );
  }
}

export default Login;
