import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, FormGroup, label, Modal } from "react-bootstrap";

class suggestionPopUp extends Component {
  state = {
    numberArray: [],
  };

  componentDidMount() {
    this.initial_Method();
    // this.designCheck_Method();
  }

  designCheck_Method = () => {
    this.setState({
      numberArray: [
        {
          id: 1,
          medicineName: "Paracetamol",
          mrp: 60,
          isSelected: true,
        },
        {
          id: 2,
          medicineName: "Acetaminophen",
          mrp: 80,
          isSelected: false,
        },
        {
          id: 3,
          medicineName: "Amitriptyline Ativan",
          mrp: 100,
          isSelected: false,
        },
        {
          id: 4,
          medicineName: "Atorvastatin Azithromycin",
          mrp: 90,
          isSelected: false,
        },
        {
          id: 5,
          medicineName: "Ativan",
          mrp: 120,
          isSelected: false,
        },
      ],
    });
  };

  initial_Method = () => {
    const demoarray = this.props.listArray.map((val, index) => {
      if (index == 0) {
        return { ...val, isSelected: true };
      } else {
        return { ...val, isSelected: false };
      }
    });

    this.setState({
      numberArray: demoarray,
    });
  };

  handelClose = () => {
    this.props.onClose();
  };

  selectNumber = (arg_indx) => {
    let demoarr = this.state.numberArray.map((val, ind) => {
      return { ...val, isSelected: ind === arg_indx ? true : false };
    });

    this.setState({
      numberArray: demoarr,
    });
  };

  handelSave = () => {
    let demoarr = this.state.numberArray.filter((val, ind) => {
      if (val.isSelected) return { ...val };
    });
    this.props.onClose(demoarr[0]);
  };

  render() {
    return (
      <>
        <div className="counter-bg"></div>
        <div className="container">
          <div className="counter-modal counter-table-modal">
            <div className="modal-top-area">
              <p>Select Any Substitute Suggestion</p>
            </div>
            <div className="modal-body-area">
              {/* <div className="counter-name">
                <ul>
                  {this.state.numberArray.map((val, index) => (
                    <li
                      key={index.toString()}
                      className={val.isSelected ? "selected" : null}
                      onClick={() => this.selectNumber(index)}
                    >
                      {val.medicineName}
                    </li>
                  ))}
                </ul>
              </div> */}

              <div className="counter-name">
                <table className="table table-borderless table-hover">
                  <thead class="thead-light">
                    <tr>
                      <th scope="col"></th>
                      <th scope="col">Medicine Name</th>
                      <th scope="col" className="last-child-2nd">MRP</th>
                      <th scope="col" className="last-child">Copay (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.numberArray.map((val, index) => (
                      <tr
                        key={index.toString()}
                      // className={val.isSelected ? "selected" : null}
                      // onClick={() => this.selectNumber(index)}
                      >
                        <td>
                          <div className="form-check">
                            <label className="form-check-label">
                              <input className="form-check-input" type="radio" 
                              value={index} name="medicineChoice" onChange={() => this.selectNumber(index)} />
                                <span className="checkmark"></span>
                                {/* Phone Number */}
                              </label>
                          </div>
                          {/* <Button
                            style={{
                              backgroundColor: val.isSelected
                                ? "#19A5C8"
                                : "#fff",
                            }}
                            onClick={() => this.selectNumber(index)}
                          ></Button> */}
                        </td>
                        <td>{val.medicineName}</td>
                        <td>
                          <span>&#8377;</span> {val.mrp}
                        </td>
                        <td>{val.copay}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="table-button-area">
              <div className="btn-col-1">
                <Button variant="warning" onClick={this.handelClose}>
                  Cancel
                </Button>
              </div>
              <div className="btn-col-1">
                {" "}
                <Button variant="success" onClick={this.handelSave}>
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default suggestionPopUp;
