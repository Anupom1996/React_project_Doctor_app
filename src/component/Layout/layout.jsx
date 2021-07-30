import React, { Component, Fragment } from "react";
import Header from "../Common/Header";
// import Footer from "../Footer/footer";
import Sidebar from "../Common/sidebar";
// import API from "../../shared/admin-axios";
import BASICAPI from "../../shared/axios";
import whitelogo from "../../assets/images/drReddyLogo.png";
import AXIOS from "axios";

class Layout extends Component {

  state = {
    user: {
      userName: "",
      roleName: "",
      roleShortCode: "",
      email: "",
      phoneNumber: "",
      defaultMenuLink: ""
    },
    menus: [],
    isLoading: true
  }

  async getDetails() {
    const userdata = localStorage.getItem('userdata');
    console.log(userdata);
    // if (userdata !== null) {
      await this.setState({
        isLoading: false,
        user: JSON.parse(userdata)
      })
    // }
  }

  componentDidMount() {
    this.getDetails();
    document.body.classList.add("admin-skin-blue");
    document.body.classList.add("sidebar-mini");
    document.body.classList.add("sidebar-open");
    document.body.classList.remove("sidebar-collapse");
    
  }
  render() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") ? true : false;

    if (this.state.isLoading === true && isLoggedIn === true) {
      return (
        <Fragment>
          <div className="loderOuter">
            <div className="loading_reddy_outer">
              <div className="loading_reddy">
                <img src={whitelogo} alt="logo" />
              </div>
            </div>
          </div>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css"
          ></link>
          <div className="daashboard-bg">
            <div className="main-body">
              
              <div className="container">
              <div className="pageWrapper">
                {/* header-panel     */}
                <Header isLoggedIn={isLoggedIn} noshow="true"></Header>
                <div className="data-part">
                  <Sidebar isLoggedIn={isLoggedIn} menus={this.state.menus} history={this.props.history} />
                    <div className="right-body">
                      {this.props.children}
                    </div> 
                </div>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      );
    }
  }
}

export default Layout;