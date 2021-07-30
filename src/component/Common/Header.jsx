import React, { Component } from "react";
import { browserHistory } from 'react-router';
import { Link, Redirect } from "react-router-dom";
import { Button, FormGroup, label, OverlayTrigger, Tooltip } from "react-bootstrap";
import AXIOS from "axios";
import moment from "moment";
import BASICAPI from "../../shared/axios";
import naturallogoimg from "../../assets/images/natural-logo.png";
import logoIcon from "../../assets/images/SvaasLogo.svg";
import userImage from "../../assets/images/profile-icon.svg";
// import ReactTooltip from 'react-tooltip';

const axiosVal = {
  instanceAxios: null,
};

class Header extends Component {

  //--- FUNCTION OF NAVIGATION BAR
  state = {
    openProfile: false,
    isLoading: false,
    countNotSeen: 0,
    noshow: false
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
    // this.getNotificationsCount();
    document.body.classList.add("sidebar-open");
  }

  getNotificationsCount = async () => {
    console.log(this.props)
    if (this.props.noshow && this.props.noshow !== null) {
      this.setState({
        noshow: this.props.noshow
      })
    }

    await axiosVal.instanceAxios.get("/pharmacy-app/notification-count")
      .then((res) => {
        this.setState({
          isLoading: false,
        });
        if (res.status === 200) {
          this.setState({
            countNotSeen: res.data.notSeen,
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

  displayProfile = () => {
    this.setState({
      openProfile: !this.state.openProfile,
    });
  };

  displayNotification = () => {
    this.setState({
      openProfile: false,
    });
  };

  setContainerRef = (node) => {
    this.containerRef = node;
  };

  handleEditProfileEvent = () => {
    // window.location.href = "#/editprofile";
    // this.props.history.push("/editprofile");
  };

  handleLogoutEvent = (e) => {
    e.preventDefault();
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
    instanceAxios
      .post("/api/auth/signout")
      .then((res) => {
        if (res.status === 200) {
          localStorage.clear();
          //   return <Redirect to="/login" />
          window.location.hash = "/login";
          //   this.props.history.push("/login");
          // browserHistory.push('/login');
        }
      })
      .catch((err) => {
        // action.setErrors(err.data.errors)
        console.log("Error in Logout");
        localStorage.clear();
        // return <Redirect to="/login" />
        window.location.hash = "/login";
        //   this.props.history.push("/login");
        // browserHistory.push('/login');
      });
  };

  handleToggleMenu = () => {
    if (document.body.classList.contains("sidebar-open")) {
      document.body.classList.remove("sidebar-open");
      document.body.classList.add("sidebar-collapse");
    } else if (document.body.classList.contains("sidebar-collapse")) {
      document.body.classList.remove("sidebar-collapse");
      document.body.classList.add("sidebar-open");
    }
  };

  render() {

    if (this.props.isLoggedIn !== true) return null;

    let userdata = localStorage.getItem('userdata');
    // let userImage = "";
    let userName = "";
    let userQualification = "";
    let userSpec = "";

    if (userdata && userdata !== "") {
      let userObj = JSON.parse(userdata);
      // userImage = userObj.profilePicture;
      userName = userObj.name;
      userQualification = userObj.qualification;
      userSpec = userObj.specialization;
    }
    let currDateTime = moment();
    console.log(currDateTime.format('DD-MM-YYYY HH:mm'));

    return (
      <>
       
        <div className="header-panel">
          <div className="header-left">
            {/* <img src={userImage} className="doctorImage" alt="User Img" />
            <span>Welcome {userName} 
              {userQualification && userQualification !== '' ? ( " - " + userQualification ) : null} 
              {userSpec && userSpec !== '' ? ( " | " + userSpec ) : null} </span> */}

              <Link to={{ pathname: "/" }} className="logoSection" >
                <img src={logoIcon} alt="Dr Reddys" />
              </Link>


            </div>
            {/* <div className="col-5 text-center d-flex align-items-center">
              <h5>Welcome {userName} 
              {userQualification && userQualification !== '' ? ( " - " + userQualification ) : null} 
              {userSpec && userSpec !== '' ? ( " | " + userSpec ) : null} </h5>
            </div> */}
            <div className="text-center d-flex align-items-center justify-content-end headerRight">
            
            {/* {currDateTime.format('DD-MM-YYYY HH:mm')} |  */}
            {/* <img src={require("../../assets/images/support_icon.png")} alt="Support Img" style={{width: '30px', marginLeft: '15px' }}/>  */}
            {/* <Link to="#" onClick={this.handleLogoutEvent} className="btn btn-default btn-flat" > Logout </Link> */}
            <p><span>Welcome {userName} </span><br /></p>
              <img
                      src={userImage}
                      className="profileImg"
                      alt="User Img"
                    />
            {/* <img src={require("../../assets/images/SvaasLogo_Openfilecoloursvg.svg")} className="headerRightImg" alt="User Img" /> */}
           
            {/* <div className="col-2">
            <img src={require("../../assets/images/SvaasLogo_Openfilecoloursvg.svg")} className="" alt="User Img" />
            </div> */}
          
          
          <div className="navbar-toggle" onClick={this.handleToggleMenu} title="Menu">
            <div className="bar1"></div>
            <div className="bar2"></div>
            <div className="bar3"></div>
          </div>
          </div>
          </div>
      








        
      </>
    );
  }
}

export default Header;