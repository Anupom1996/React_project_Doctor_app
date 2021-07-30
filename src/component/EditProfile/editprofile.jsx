import React, { Component } from "react";
import { Link } from "react-router-dom";

import arrowbtn from "../../assets/images/arrow-btn.svg";
import { Button, FormGroup, label } from "react-bootstrap";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import AXIOS from "axios";
import BASICAPI from "../../shared/axios";
import Swal from "sweetalert2";
import moment from "moment";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import ModalView from "../ModalView/modalMap";
import ModalLoader from "../Loader/loader";
import Layout from "../Layout/layout";
import doclogo from "../../assets/images/profile-img.png";

const axiosVal = {
  instanceAxios: null,
};

let userDetails = {};

class EditProfile extends Component {
  state = {
    isLoading: true,
    userDetails: [],
  };

  constructor() {
    super();
    const accessToken = localStorage.getItem("access_token");
    axiosVal.instanceAxios = AXIOS.create({
      baseURL: process.env.REACT_APP_API_URL,
    });
    axiosVal.instanceAxios.interceptors.request.use(
      (config) => {
        // Insert authorization token on request call
        config.headers["Authorization"] = `Bearer ${accessToken}`;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    axiosVal.instanceAxios.interceptors.response.use(
        (response) => {
          return response;
        },
        (error) => {
          return Promise.reject(error.response);
        }
    );
    localStorage.setItem('userDetails', JSON.stringify(this.state.userDetails));
  }
      
  componentDidMount() {
    window.scrollTo(0, 0);
    this.fetchUserDetails();
    // this.setState({
    //   isLoading: false
    // })
  }

  fetchUserDetails = async () => {
    await axiosVal.instanceAxios.get("/doctor-app/view")
      .then((res) => {
        if (res.status === 200) {
          let detail = res.data;
          
          this.setState({
            userDetails: res.data,
            isLoading: false,
          });
        }
      })
      .catch((err) => {
        if (err && err.status === 401) {
          localStorage.removeItem("access_token");
          const ref_token = localStorage.getItem("refresh_token");
          BASICAPI.post("/api/auth/generate/token", {
            grant_type: "refresh_token",
            refresh_token: ref_token,
          })
            .then((res) => {
              if (res.status === 200) {
                localStorage.setItem("access_token", res.data.access_token);
                window.location.reload(true);
              }
            })
            .catch((error) => {
              localStorage.clear();
              window.location.href = "/";
            });
        }
        this.setState({
          isLoading: false,
        });
      });
  };

  render() {

    if (Object.keys(userDetails).length <= 0 ) {
      userDetails  = this.state.userDetails;
    }

    const detail = this.state.userDetails;

    return (
      <Layout history={this.props.history}>
        <div className="content-wrapper">
                  <div className="">
                    {/* <div className="area-img">
                      <img src={detail.profilePicture ? detail.profilePicture : doclogo} alt="logo" />
                    </div> */}
                    <div className="area-cont">
                    <div className="profileDetailsBox">
                      <div className="area-cont-head d-flex justify-content-between">
                        <h4 style={{ fontSize: '24px' }}>Doctor Detail</h4>
                        <div className="d-flex" style={{ marginBottom: '10px' }}>
                          <Link
                            to="/changepassword"
                            className="btn btn-default btn-flat password-btn"
                          >
                            Change password
                          </Link>
                        </div>
                      </div>
                      <div className="row profileDetailsSec">
                        <div className="col-md-6">
                          <ul>
                            <li>
                              <span>Name :</span>{" "}
                              <span>{detail.name}</span>
                            </li>
                            <li>
                              <span>Email :</span> <span>{detail.email}</span>
                            </li>
                            <li>
                              <span>Contact No :</span>{" "}
                              <span>{detail.contactNumber}</span>
                            </li>
                            <li>
                              <span>Gender :</span> 
                              <span>{detail.gender}</span>
                            </li>
                            <li>
                              <span>Clinic :</span> 
                              <span>{detail.clinicAddress}</span>
                            </li>
                            <li>
                              <span>Clinic Address :</span> 
                              <span>{detail.address}</span>
                            </li>
                            <li>
                              <span>Qualifications :</span> 
                              <span>{detail.qualification}</span>
                            </li>
                          </ul>
                        </div>
                        <div className="col-md-6">
                          <ul>
                            <li>
                              <span>Date of Birth :</span>{" "}
                              <span>{detail.dateOfBirth && detail.dateOfBirth !== "" ? 
                                  moment(detail.dateOfBirth).format('DD-MM-YYYY')
                              : null}</span>
                            </li>
                            <li>
                              <span>DRL Id :</span>{" "}
                              <span>{detail.drlDoctorId}</span>
                            </li>
                            <li>
                              <span>Health Plix Id :</span>{" "}
                              <span>{detail.hplixDoctorId}</span>
                            </li>
                            <li>
                              <span>MCI No :</span>{" "}
                              <span>{detail.mciNumber}</span>
                            </li>
                            <li>
                              <span>Specialization :</span>{" "}
                              <span>{detail.specialization}</span>
                            </li>
                            <li>
                              <span>Year of Experience :</span> 
                              <span>{detail.yearOfExperience}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    </div>
                  </div>
                
              {this.state.isLoading && <ModalLoader />}
            
        </div>
      </Layout>
    );
  }
}

export default EditProfile;
