import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import {
  Route,
  Switch,
  // Redirect
} from "react-router-dom";

import AdminComponent from './routes/Admin.jsx';
// import UserComponent from './routes/User.jsx';

class App extends Component {
  render() {
    return (
        <div className="wrapper" style={{height: 'auto'}}>
          <Switch>
            <Route path='/' component={AdminComponent}/>
            {/* <Route path='/' component={UserComponent}/> */}
            {/* <Route render={() => <Redirect to={{pathname: "/"}} />} /> */}
          </Switch>
        </div>
    );
  }
}

export default App;
