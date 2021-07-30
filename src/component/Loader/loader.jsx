import React, { Component } from "react";

class Loader extends Component {
  componentDidMount() { }

  render() {
    return (
      <>
        <div className="loader-outer"> </div>
        <div className="loader">
          <div id="status" className="ball-triangle-path">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </>
    );
  }
}

export default Loader;
