import React, { Component } from "react";
import { Link } from "react-router-dom";
import eyeimg from "../../assets/images/arrow-btn.svg";
import Pagination from "react-js-pagination";
import { Row, Col, Table } from "react-bootstrap";
import AXIOS from "axios";
import BASICAPI from "../../shared/axios";
import moment from "moment";
import Header from "../Common/Header";
import NotificationPopup from "../Popup/popupnotification";

const axiosVal = {
  instanceAxios: null,
};

const singlePageLimit = 5;

class Notification extends Component {
  state = {
    notificationArray: [],
    count: 0,
    activePage: 1,
    Notification_PopUp: false,
    notificationData: {}
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
  }

  componentDidMount() {
    this.getNotifications();
  }

  getNotifications = async () => {
    this.setState({
      isLoading: true,
    });
    
    let pageString = "";
    
    if (this.state.activePage > 0) {
      pageString += "&pageNo=" + (this.state.activePage - 1);
    }

    await axiosVal.instanceAxios.get("/pharmacy-app/notifications?pageSize=" + singlePageLimit + pageString )
      .then((res) => {
        this.setState({
          isLoading: false,
        });
        if (res.status === 200) {
          this.setState({
            notificationArray: res.data.entries,
            count: res.data.total,
          });
        }
      })
      .catch((err) => {
        console.log("Error in Api", err);
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
              // action.setErrors(err.data.errors)
              console.log("Token expired");
              localStorage.clear();
              window.location.href = "/";
            });
        }
        this.setState({
          isLoading: false,
        });
      });
  }

  showNotification = async (nid) => {
    // this.setState({
    //   isLoading: true,
    // });

    await axiosVal.instanceAxios.get("/pharmacy-app/notifications/" + nid )
    .then((res) => {
      this.setState({
        isLoading: false,
      });
      if (res.status === 200) {
        this.setState({
          notificationData: res.data,
          Notification_PopUp: true,
        });
      }
    })
    .catch((err) => {
      console.log("Error in Api", err);
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
            // action.setErrors(err.data.errors)
            console.log("Token expired");
            localStorage.clear();
            window.location.href = "/";
          });
      }
      this.setState({
        isLoading: false,
      });
    });
  }

  close_NotificationPopup = () => {
    this.setState({ Notification_PopUp: false });
    this.props.history.push("/notification");
  };
  
  handlePageChange = async (pageNumber) => {
    await this.setState({
      activePage: pageNumber,
      isLoading: true,
    });
    this.getNotifications();
  }

  render() {
    return (
      <>
        <div className="daashboard-bg">
          <div className="container">
            <Header></Header>
            {/* <div className="back-button">
              <Link to="/receivables">
                <img src={eyeimg} alt="Dr Reddys" /> <span>Back</span>
              </Link>
            </div> */}
            <div className="drop-content">
              {!this.state.notificationArray || this.state.notificationArray.length === 0 ? (
                <div className="no-content-main">
                  <div className="container">
                    <div className="no-content-found">
                      <p>No Content Found</p>
                    </div>
                  </div>
                </div>
              ) : (
                <ul className="list-item">
                  {this.state.notificationArray.map((val, index) => (
                    <li key={index.toString()}
                      onClick={() => this.showNotification(val.id)}
                    >
                      <div className="note-sub">
                        <h5>{val.subject}</h5>
                        <hr />
                        <div className="note-content">
                          <p>{val.message}</p>
                        </div>
                        <p className="time">
                          {moment(new Date(val.createdDate)).format(
                            "DD-MM-YYYY"
                          )}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {this.state.count > singlePageLimit ? (
                  <Row>
                    <Col md={12}>
                      <div className="paginationOuter text-right">
                        <Pagination
                          activePage={this.state.activePage}
                          itemsCountPerPage={singlePageLimit}
                          totalItemsCount={this.state.count}
                          itemClass="nav-item"
                          linkClass="nav-link"
                          activeClass="active"
                          onChange={this.handlePageChange}
                        />
                      </div>
                    </Col>
                  </Row>
                ) : null}
            </div>
          </div>
        </div>
        {this.state.Notification_PopUp && (
          <NotificationPopup
            data={this.state.notificationData}
            onClose={this.close_NotificationPopup}
          />
        )}
      </>
    );
  }
}

export default Notification;
