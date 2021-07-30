import React, { Component } from "react";
// import { Link } from "react-router-dom";
import { Button, FormGroup, label } from "react-bootstrap";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import AXIOS from "axios";
import BASICAPI from "../../shared/axios";
import Swal from "sweetalert2";
import eyecrossimg from "../../assets/images/icon-01.svg";
import Header from "../Common/Header";
import ModalLoader from "../Loader/loader";
import Layout from "../Layout/layout";
const singlePageLimit = 5;

const axiosVal = {
  instanceAxios: null,
};

const validateLogin = Yup.object().shape({
  username: Yup.string().required("Please enter your Order ID"),
});

class Supportarea extends Component {
  state = {
    isLoading: false,
    technicalEmail: "",
    technicalMobile: "",
    supportEmail: "",
    supportMobile: ""
  }

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
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.fetchSupportDetails();
  }

  fetchSupportDetails = async () => {
    this.setState({
      isLoading: true,
    });

      await axiosVal.instanceAxios.get("/doctor-app/support-info")
        .then((res) => {
          if (res.status === 200) {
            let detail = res.data;
            
            this.setState({
              isLoading: false,
              technicalEmail: detail.technicalEmail,
              technicalMobile: detail.technicalPhone,
              supportEmail: detail.accountingEmail,
              supportMobile: detail.accountingPhone
            });
          }
        })
        .catch((err) => {
          if (err && err.status === 401) {
            localStorage.removeItem("access_token");
            const ref_token = localStorage.getItem("refresh_token");
            BASICAPI.post("/api/auth/generate/token", { grant_type: "refresh_token", refresh_token: ref_token })
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
          } else {
            Swal.fire("Error: " + err.data.message);
          }
          this.setState({
            isLoading: false,
          });
        });
  }

  render() {
    const newInitialValues = {
      username: "",
    };
    return (
      <>
      <Layout history={this.props.history}>
        <div className="content-wrapper">
          <div className="box-area">
            <div className="supportBg">
              <form style={{ marginTop: "50px", minHeight: "500px" }}>
                <div className="row">
                  <div className="col-md-12">
                    <div className="supportWrapper">
                      <h2>
                        Accounting and Service queries </h2>
                      <ul style={{textAlign:'center'}}>
                        <li className="email"> {this.state.supportEmail} </li>
                        <li className="phone"> {this.state.supportMobile} </li>
                        
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-12 mt-5">
                    <div className="supportWrapper">
                        <h2> Technical queries </h2>
                        <ul style={{textAlign:'center'}}>
                          <li className="email"> {this.state.technicalEmail} </li>
                          <li className="phone"> {this.state.technicalMobile} </li>
                        </ul>                  
                    </div>
                  </div>
                </div>
              </form>
              {this.state.isLoading && <ModalLoader />}
            </div>
          </div>
        </div>
      </Layout>
      </>
    );
  }
}

export default Supportarea;
