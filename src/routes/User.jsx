import React, { Component } from "react";
import {
  Route,
  Switch,
  BrowserRouter,
  HashRouter
} from "react-router-dom";
// import 'react-app-polyfill/ie11';
//import logo from './logo.svg';
//import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// home
import "../assets/css/style.css";
import "../assets/css/dbstyle.scss";

// other
import "../assets/css/innerpagestyle.css";

import "../assets/css/responsive.css";
// import 'react-circular-progressbar/dist/styles.css';
import "../assets/css/loaders.css";

import Home from "../component/Home/home.jsx";
import Login from "../component/Login/login";
// import LoginAll from "../component/Login/login-all";
// import StartupLogin from "../component/Login/login-startup-acc";
// import Dashboard from "../component/Dashboard/dashboard";
// import Employeedb from "../component/Employeedb/employee-db";
// import Create_Challenge from "../component/Create_Challenge/create-a-challenge";
// import Startup_Chalenges from "../component/Startup_Chalenges/startup-chalenges";
// //import Forget_Password from "../component/Forget_password/forget-password";
// //import Reset_Password from "../component/Reset_password/reset-password";
// //import Set_Password from "../component/Set_password/set-password";
// import Profile from "../component/Profile/profile";
// import { PrivateRoute } from "../shared/private-route";
// import Challenge_Details from "../component/Challenge_Details/challenge-details";
// import Challenge_Evaluation from "../component/Challenge_Details/challenge-evaluation";
// import Apply_Challenge from "../component/Apply_Challenge/apply-challenge";
// import Startup_Details from "../component/Startup_Details/startup-details";
// import Accelerators from "../component/Accelerators/accelerators";
// import Startup_Catalogue from "../component/Startup_Catalogue/startup-catalogue";
// //import Startup_technology_List from "../component/Startup_Catalogue_List/startup-catalogue-tech-list";
// //import Startup_business_List from "../component/Startup_Catalogue_List/startup-catalogue-busi-list";
// import Newsfeed from "../component/Newsfeed/newsfeed";
// import Newsfeed_Details from "../component/Newsfeed_Details/newsfeed-details";
// import AcceleratorsProfile from "../component/Accelerators/accelerators_profile";
import Layout from '../component/Layout/layout.jsx';

// import Evaluation from "../component/Evaluation/evaluation";

// import Accelerator_Details from "../component/Accelerators/accelerators_details";
// Test Date Parser 
// import DateParser from "../component/Test/dateparser";

class User extends Component {

  render() {
    
    return (
      <div className="wrapper">        
        
            <Layout {...this.props}>
              
              <Route exact path='/login' component={Login}/>
              
              <Route exact path='/home' component={Home}/>
              <Route exact path='/' component={Home}/>
              
          </Layout>
      </div>
    );
  }
}



export default User;