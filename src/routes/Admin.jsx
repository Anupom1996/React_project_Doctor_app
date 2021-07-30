import React, { Component } from "react";

import { Route, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table/dist/react-bootstrap-table.min.css";

import "../assets/css/style.css";
import "../assets/css/responsive.css";
import "../assets/css/loader.css";
import "../assets/css/admin-style.css";
import "../assets/css/admin-skin-blue.css";
import Home from "../component/Home/home";
import Forgotpassword from "../component/Forgotpassword/forgot-password";
import OTP from "../component/Otp/otp";
import Confirmpassword from "../component/ConfirmPassword/confirmpassword";
import EditProfile from "../component/EditProfile/editprofile";
import Notification from "../component/Notification/notification";

import Login from "../component/Login/login";
import Dashboard from "../component/Dashboard/dashboard";
import ChangePassword from "../component/ChangePassword/changepassword";
import ResetPassword from "../component/ResetPassword/resetpassword";
import Recievables from "../component/Analytics/recievables";
import Appointment from "../component/Dashboard/appointment";
import Supportarea from "../component/Support/supportarea";

// Private Route for inner component
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    component={(props) =>
      localStorage.getItem("access_token") !== null &&
      localStorage.getItem("refresh_token") !== null ? (
        <Component {...props} />
      ) : (
        <Redirect to="/" />
      )
    }
    // render={(props) =>
    //   localStorage.getItem("access_token") !== null &&
    //   localStorage.getItem("refresh_token") !== null ? (
    //     <Component {...props} />
    //   ) : (
    //     <Redirect to="/" />
    //   )
    // }
  />
);

class Admin extends Component {
  render() {
    return (
      <div>
        <PrivateRoute exact path="/editprofile" component={EditProfile} />
        <PrivateRoute exact path="/notification" component={Notification} />
        <PrivateRoute exact path="/receivables" component={Recievables} />
        <PrivateRoute exact path="/appointment/:id" component={Appointment} />
        <PrivateRoute exact path="/support" component={Supportarea} />
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/forgotpassword" component={Forgotpassword} />
        <Route exact path="/confirmpassword" component={Confirmpassword} />
        <Route exact path="/setnewpassword" component={ResetPassword} />
        <Route exact path="/changepassword" component={ChangePassword} />
        <Route exact path="/otp" component={OTP} />
        <Route exact path="/" component={Home} />
      </div>
    );
  }
}

export default Admin;
