import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import eyeimg from "../../assets/images/arrow-btn.svg";

// form, fields, validation, schemas
import { Button, FormGroup, label } from "react-bootstrap";
import { Formik, Field, Form } from "formik";
import OtpInput from "react-otp-input";
import AXIOS from "axios";
import Swal from "sweetalert2";
import ModalLoader from "../Loader/loader";
import logoImage from "../../assets/images/SvaasLogo-Login.svg";

class Otp extends Component {
  state = {
    otp: "",
    isLoading: false,
    timer: 30
  };

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

  handleSubmitEvent = () => {
    this.setState({
      isLoading: true,
    });
    console.log("OPT ----->>>> ", this.state.otp);

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

    let otp = this.state.otp;
      // username: this.props.location.tagDetails.username,
    let userName = localStorage.getItem("USER_ID");

    instanceAxios
      .get("/api/auth/doctor-app/forgot-password-verify-otp?otp=" + otp + "&userName=" + userName)
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            isLoading: false,
          });
          // Swal.fire(res.data.message);
          localStorage.setItem("OTP_ID", otp);
          this.props.history.push({
            pathname: "/confirmpassword"
          });
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

  resendOTP = () => {
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
      deviceId: "12548fdfdf14257141ffdfdf144741",
      username: localStorage.getItem("USER_ID"),
    };

    console.log("POSTING ----->>>> ", postingPram);

    // .post("/api/auth/app/forgot-password", postingPram)
    instanceAxios
      .get("/api/auth/doctor-app/forgot-password-send-otp?userName=" + postingPram.username)
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            isLoading: false,
          });
          console.log("RESPONSE ----->>>> ", res);
          // Swal.fire(res.data.message);
          Swal.fire("OTP has been sent on your registered Email id / Mobile No");
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
    // let otpId = localStorage.getItem("OTP_ID");
    let userId = localStorage.getItem("USER_ID");
    // console.log(otpId, userId)
    if (userId === "" || userId === null) {
      return <Redirect to="/login" />;
    }
    let otpId = localStorage.getItem("OTP_ID");
    // let userId = localStorage.getItem("USER_ID");
    console.log(otpId, userId)
    // if (otpId !== null && otpId !== "" && userId !== null) {
    //   return <Redirect to="/forgotpassword" />;
    // }
    
    return (
      <>
        {/* <div className="back-button">
          <Link to="/login">
            <img src={eyeimg} alt="Svaas" /> <span>Back</span>
          </Link>
        </div> */}
        <div className="daashboard-bg">
        <div className="Newlogin-box">

        <div className="login-box-body">

        <div className="loginLogo">
                  <Link to="/" className="logo" onClick={(event)=>{event.preventDefault();}}>
                    <span className="logo-lg">
                      <img src={logoImage} alt="Svaas" />
                    </span>
                  </Link>
                </div>

          <h2>Verify your account via OTP</h2>
          {/* <p>
            OTP has been sent to you on your Email / Mobile number. Please enter
            it below.
          </p> */}
          <div className="otp-field-area">
            <p className="tofonts">One time password</p>
            <div className="otp-form-group">
              <OtpInput
                value={this.state.otp}
                onChange={this.handleChange}
                numInputs={6}
                //separator={<span>-</span>}
              />
            </div>
            {/* 
              <div className="otp-form-group">
                  <div className="form-group">
                    <Field
                      name="otp"
                      type="text"
                      className="form-control"
                      autoComplete="off"
                      placeholder="0"
                    />
                  </div>
                  <div className="form-group">
                    <Field
                      name="otp"
                      type="text"
                      className="form-control"
                      autoComplete="off"
                      placeholder="0"
                    />
                  </div>
                  <div className="form-group">
                    <Field
                      name="otp"
                      type="text"
                      className="form-control"
                      autoComplete="off"
                      placeholder="0"
                    />
                  </div>
                  <div className="form-group">
                    <Field
                      name="otp"
                      type="text"
                      className="form-control"
                      autoComplete="off"
                      placeholder="0"
                    />
                  </div>
                </div> 
            */}
              {this.state.timer > 0 ? (
                <p className="timeMsg">
                  {/* Enter number within <span>0:{this.state.timer}</span> sec. */}
                  Resend OTP option in <span>0:{this.state.timer}</span> sec
                </p>
              ) : (
                  <p className="received">
                    Did not receive OTP ?
                    <Button
                      className="checkbox-text resend-otp"
                      onClick={() => this.resendOTP()}
                    >
                      Resend
                    </Button>
                  </p>
              )}
          </div>

          <div className="btn-toolbar">
            <Button
              type="submit"
              variant="success"
              onClick={this.handleSubmitEvent}
            >
              Set Password
            </Button>
          </div>
          <div className="forgot-password text-center resend">
            <Link to="/login" style={{ fontSize: "18px"}}>Cancel</Link>
          </div>
        </div>
        {this.state.isLoading && <ModalLoader />}
        </div>
        </div>
      </>
    );
  }
}

export default Otp;
