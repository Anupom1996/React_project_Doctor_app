import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import insuranaceLlogo from "../../assets/images/products-icon.png";
import AXIOS from "axios";
import BASICAPI from "../../shared/axios";
import dashboardImage from "../../assets/images/products-icon.png";
import productsImage from "../../assets/images/products-icon.png";
import analyticsImage from "../../assets/images/products-icon.png";

import LogoutIcon from "../../assets/images/logout-icon.svg";
import SupportIcon from "../../assets/images/support-icon.svg";
import MyProfileIcon from "../../assets/images/my-profile-icon.svg";
import CreateNewIcon from "../../assets/images/create-new-order-icon.svg";
import MyCompleteOrderIcon from "../../assets/images/my-completed-orders-icon.svg";
import MyRecivablesIcon from "../../assets/images/my-recievables-icon.svg";

class Sidebar extends Component {
  state = {
    menuitem: {},
    menus: null,
  };

  constructor() {
    super();
    const menuFetch = localStorage.getItem("menudata");
    if (menuFetch) {
      this.state.menuitem = JSON.parse(menuFetch);
      // this.getMenusHandler();
    }
  }
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
  getMenusHandler = () => {
    let menus = null;

    if (this.state.menuitem.length) {
      let targetPath = null;
      let targetImage = "../../assets/images/";
      let subtargetPath = null;
      let subtargetImage = "../../assets/images/";

      menus = (
        <ul className="sidebar-menu">
          {this.state.menuitem.map((menu, index) => {
            if(menu.link === null) {
              targetPath='';
            } else {
              targetPath = "/"+menu.link.toLowerCase();
            }
            targetImage += menu.icon + ".png";
            let imageId = menu.menuName + "Image";
            let img = { imageId };
            let liClass = "";
            if (Array.isArray(menu.subMenu) && menu.subMenu.length) {
              liClass = "has-dropdown";
            }

            return (
            
              <li key={menu.id} className={liClass} >
                {menu.link === null ? (
                  <a>
                    <img src={ parseInt(index) == 0 ? dashboardImage : parseInt(index) == 1 ? productsImage : analyticsImage }
                      className="user-image" alt="User Img" />
                    <span>
                      {menu.menuName == "Product(Insurance Policy) Management" ? "Product (Insurance Policy) Management" : menu.menuName}
                    </span>
                  </a>
                ) : (
                    <NavLink to={targetPath} activeClassName="active">
                      <img src={ parseInt(index) == 0 ? dashboardImage : parseInt(index) == 1 ? productsImage : analyticsImage }
                        className="user-image" alt="User Img" />
                      <span>
                        {menu.menuName == "Product(Insurance Policy) Management" ? "Product (Insurance Policy) Management" : menu.menuName}
                      </span>
                    </NavLink>
                )}
                { (Array.isArray(menu.subMenu) && menu.subMenu.length ) ? (
                    <ul className="treeview-menu">
                      { menu.subMenu.map((submenu, index) => {
                        subtargetPath = "/"+submenu.link.toLowerCase();
                        subtargetImage += submenu.icon + ".png";
                        let imageId = submenu.menuName + "Image";
                        let img = { imageId };
                        return (
                          <li key={submenu.id}>
                            <NavLink to={subtargetPath} activeClassName="active">{submenu.menuName}</NavLink>
                          </li>
                        );
                      })}
                    </ul>
                  ) : "" 
                }
              </li>
            );
          })}
        </ul>
      );

      this.state.menus = menus;
    }
  };

  render() {
    if (this.props.isLoggedIn !== true) return null;

    return (
      <aside className="main-sidebar">
        {/* <div className="logo-lg">
          <img src={insuranaceLlogo} alt="Dr.Reddy's" />
        </div> */}
        <section className="sidebar">
          <ul className="sidebar-menu">
            <li> <NavLink to="/receivables" activeClassName="active">
              <img src={MyRecivablesIcon} className="user-image" alt="User Img" />
              <span>My <br />Receivables</span></NavLink> </li>
            <li> <NavLink to="/dashboard" activeClassName="active">
              <img src={MyCompleteOrderIcon} className="user-image" alt="User Img" />
              <span>Completed Appointments</span></NavLink> </li>
            <li > <NavLink to="/editprofile" activeClassName="active">
              <img src={MyProfileIcon} className="user-image" alt="User Img" />
              <span>My Profile</span></NavLink>              
            </li> 
            <li > <NavLink to="/support" activeClassName="active">
              <img src={SupportIcon} className="user-image" alt="User Img" />
              <span>Support</span></NavLink>              
            </li>
          </ul>
          {this.state.menus}
          <ul className="sidebar-menu logOutBtn">
          <li className=""> <NavLink to="" onClick={this.handleLogoutEvent} activeClassName="">
              <img src={LogoutIcon} className="user-image" alt="User Img" />
              <span>Logout</span></NavLink>              
            </li>
            </ul>
        </section>
      </aside>
    );
  }
}

export default Sidebar;
