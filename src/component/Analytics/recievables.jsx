import React, { Component } from "react";
import { Link } from "react-router-dom";

import arrowbtn from "../../assets/images/arrow-btn.svg";
import { Button, FormGroup, label, Table } from "react-bootstrap";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import AXIOS from "axios";
import BASICAPI from "../../shared/axios";
import Swal from "sweetalert2";
import moment from "moment";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import ModalView from "../ModalView/modalMap";
import ModalLoader from "../Loader/loader";
import Layout from "../Layout/layout";
import { Chart } from "react-google-charts";
import doclogo from "../../assets/images/profile-img.png";

import boxOne from "../../assets/images/amount-receivable.svg";
import boxTwo from "../../assets/images/payment-settled.svg";
import boxThree from "../../assets/images/payment-pending.svg";
import boxFour from "../../assets/images/orders-completed.svg";

const axiosVal = {
  instanceAxios: null,
};

let userDetails = {};

class Recievables extends Component {
  state = {
    malefemaleChoice: ["Yes", "No"],
    isLoading: true,
    userDetails: [],
    filterList: [],
    searchParam: "",
    counter: [],
    barDataGoogle: [],
    pieDataGoogle: [],
    pieAmountData: [],
    totalPieData: 0,
    totalPieAmount: 0,
    sdate: "",
    viewsdate: "",
    viewedate: "",
    edate: "",
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

  componentDidMount = () => {
    window.scrollTo(0, 0);
    this.getFilterList();
    this.getData();
  }

  changeStartDateHandler = (sdate) => {
    // console.log("serviceT =========>>>>> ", new Date(sdate).toISOString());
    this.setState({
      sdate: new Date(sdate).toISOString(),
      viewsdate: new Date(sdate).toISOString(),
    });
  }

  changeEndDateHandler = (edate) => {
    // console.log("serviceT =========>>>>> ", new Date(edate).toISOString());

    this.setState({
      edate: new Date(edate).toISOString(),
      viewedate: new Date(edate).toISOString(),
    });
  }

  getFilterList = async () => {
    await axiosVal.instanceAxios.get("/doctor-app/filter-list")
      .then((res) => {
        if (res.status === 200) {
          if (res.data.length > 0) {
            let serviceP = [];
            let entries = res.data;
            serviceP = entries.map((c) => {
              let obj = {
                value: c.name,
                label: c.value,
                id: c.name,
                name: c.value,
              };
              return obj;
            });
            this.setState({
              filterList: serviceP,
            });
          }
        }
      })
      .catch((err) => {
        console.log("Error in Api");
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
              console.log("Token expired");
              localStorage.clear();
              this.props.history.push("/");
            });
        }
        this.setState({
          isLoading: false,
        });
      });
  }

  getData = async () => {
    let listsearchParam = this.state.searchParam;
    let listisSearchBtnPress = this.state.isSearchBtnPress;
    let barChartData = [];
    let pieChartData = [];
    let pieAmountData = [];
    // barChartData.push(["", "Receivable Amount", "Payment Settled", "Number of Consultations"]);
    barChartData.push(["Payment", "Amount", { role: "style" }]);
    pieChartData.push(["Claim Status", "Number"]);
    pieAmountData.push(["Claim Amount", "Amount"]);

    await this.setState({
      // isLoading: true,
      searchParam: listsearchParam,
      isSearchBtnPress: listisSearchBtnPress,
      barDataGoogle: barChartData,
      pieDataGoogle: pieChartData,
      pieAmountData,
    });

    if (localStorage.getItem("isLoggedIn")) {
      let searchString = "";
      let dateString = "";
      let viewsdate = "";
      let viewedate = "";

      if (
        this.state.viewedate === "" &&
        this.state.viewsdate === "" &&
        this.state.searchParam === ""
      ) {
        let sday = moment().startOf("month");
        let eday = moment();

        viewsdate = sday.format("MM/DD/YYYY");
        viewedate = eday.format("MM/DD/YYYY");
      } else if (this.state.searchParam === "CUSTOM_DATE_RANGE") {
        // let formatSDate = this.state.viewsdate !== '' ? new Date(this.state.viewsdate).toISOString() : '';
        // let formatEDate = this.state.viewedate !== '' ? new Date(this.state.viewedate).toISOString() : '';
        let formatSDate =
          this.state.viewsdate !== ""
            ? moment(this.state.viewsdate).format("YYYY-MM-DD")
            : "";
        let formatEDate =
          this.state.viewedate !== ""
            ? moment(this.state.viewedate).format("YYYY-MM-DD")
            : "";
        dateString += "&startDate=" + formatSDate + "&endDate=" + formatEDate;
        viewsdate = formatSDate;
        viewedate = formatEDate;
      } else {
        if (this.state.searchParam === "CURRENT_MONTH") {
          let sday = moment().startOf("month");
          let eday = moment();

          viewsdate = sday.format("MM/DD/YYYY");
          viewedate = eday.format("MM/DD/YYYY");
        } else if (this.state.searchParam === "LAST_MONTH") {
          let sday = moment().subtract(1, "months");
          let eday = moment();

          viewsdate = sday.format("MM/DD/YYYY");
          viewedate = eday.format("MM/DD/YYYY");
        } else if (this.state.searchParam === "LAST_3_MONTH") {
          let sday = moment().subtract(3, "months");
          let eday = moment();

          viewsdate = sday.format("MM/DD/YYYY");
          viewedate = eday.format("MM/DD/YYYY");
        } else if (this.state.searchParam === "LAST_6_MONTH") {
          let sday = moment().subtract(6, "months");
          let eday = moment();

          viewsdate = sday.format("MM/DD/YYYY");
          viewedate = eday.format("MM/DD/YYYY");
        } else if (this.state.searchParam === "CURR_FIN_YEAR") {
          if (moment().quarter() == 1) {
            let sday = moment()
              .subtract(1, "year")
              .month("April")
              .startOf("month");
            let eday = moment()
              .month("March")
              .endOf("month");

            viewsdate = sday.format("MM/DD/YYYY");
            viewedate = eday.format("MM/DD/YYYY");
          } else {
            let sday = moment()
              .month("April")
              .startOf("month");
            let eday = moment()
              .add(1, "year")
              .month("March")
              .endOf("month");

            viewsdate = sday.format("MM/DD/YYYY");
            viewedate = eday.format("MM/DD/YYYY");
          }
        } else if (this.state.searchParam === "LAST_FIN_YEAR") {
          if (moment().quarter() == 1) {
            let sday = moment()
              .subtract(2, "year")
              .month("April")
              .startOf("month");
            let eday = moment()
              .subtract(1, "year")
              .month("March")
              .endOf("month");
    
            viewsdate = sday.format("MM/DD/YYYY");
            viewedate = eday.format("MM/DD/YYYY");
          } else {
            let sday = moment()
              .subtract(1, "year")
              .month("April")
              .startOf("month");
            let eday = moment()
              .month("March")
              .endOf("month");
    
            viewsdate = sday.format("MM/DD/YYYY");
            viewedate = eday.format("MM/DD/YYYY");
          }
        }
      }

      this.setState({
        searchParam: this.state.isSearchBtnPress ? this.state.searchParam : "",
        viewsdate,
        viewedate,
      });

      if (this.state.searchParam !== "") {
        searchString +=
          "filter=" +
          (this.state.isSearchBtnPress ? this.state.searchParam : "");
      } else {
        searchString += "filter=CURRENT_MONTH";
      }
      
      await axiosVal.instanceAxios.get("/doctor-app/get-chart-data?" + searchString + dateString)
        .then((res) => {
          if (res.status === 200) {
              let responseData = res.data;
              let counter = []; 
              let totalPieData = 0;
              let totalPieAmount = 0;

              if (responseData && responseData.barChartData) {
                let barData = responseData.barChartData;
                let barEntry = ["Amount"];
                counter = Object.entries(barData).map(([k, v], i) => {
                  barEntry.push(v);
                  return [k, v];
                });
                console.log(counter);
                // barChartData.push(barEntry); 
                barChartData.push([
                  "Amount Receivable (" + barData.receivableAmount + ")",
                  barData.receivableAmount,
                  null,
                ]);
                barChartData.push([
                  "Payment Settled (" + barData.paymentSettled + ")",
                  barData.paymentSettled,
                  null,
                ]);
                barChartData.push([
                  "Payment Pending (" + barData.paymentNotSettled + ")",
                  barData.paymentNotSettled,
                  null,
                ]);

                // let pendingClaim = ['Pending Claim Amount', barData.paymentNotSettled];
                // let creditedClaim = ['Credited Claim Amount', barData.paymentSettled];
                // pieAmountData.push(pendingClaim);
                // pieAmountData.push(creditedClaim);
                // totalPieAmount = barData.paymentNotSettled + barData.paymentSettled ;
              } else {
                barChartData.push([
                  "Amount Receivable (0)",
                  0,
                  null,
                ]);
                barChartData.push([
                  "Payment Settled (0)",
                  0,
                  null,
                ]);
                barChartData.push([
                  "Payment Pending (0)",
                  0,
                  null,
                ]);
              }
              console.log(barChartData);
              if (responseData && responseData.pieChartData) {
                let pieData = responseData.pieChartData;
                let pendingClaim = [
                  "Number of Pending Claim",
                  pieData["noOfPendingClaim"],
                ];
                let creditedClaim = [
                  "Number of Credited Claim",
                  pieData["noOfCreditedClaim"],
                ];
                let rejectedClaim = [
                  "Number of Rejected Claim",
                  pieData["noOfRejectedClaim"],
                ];
                pieChartData.push(pendingClaim);
                pieChartData.push(creditedClaim);
                pieChartData.push(rejectedClaim);
                totalPieData =
                  pieData["noOfPendingClaim"] +
                  pieData["noOfCreditedClaim"] +
                  pieData["noOfRejectedClaim"];
              }
              
              this.setState({
                barDataGoogle: barChartData,
                counter: counter,
                pieDataGoogle: pieChartData,
                totalPieData,
                // pieAmountData,
                // totalPieAmount
              });
          }
        })
        .catch((err) => {
          console.log("Error in Api ", JSON.stringify(err));
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
            totalPieData: 0,
            counter: [],
          });
        });

      await axiosVal.instanceAxios.get( "/doctor-app/get-claim-amount-chart-data?" + searchString + dateString )
        .then((res) => {
          if (res.status === 200) {
            let responseData = res.data;
            let totalPieAmount = 0;

            if (responseData) {
              let pieData = responseData;
              let pendingClaim = [
                "Pending Claim Amount",
                pieData["pendingClaimAmount"],
              ];
              let creditedClaim = [
                "Credited Claim Amount",
                pieData["creditedClaimAmount"],
              ];
              pieAmountData.push(pendingClaim);
              pieAmountData.push(creditedClaim);
              totalPieAmount =
                pieData["pendingClaimAmount"] + pieData["creditedClaimAmount"];
            }

            this.setState({
              pieAmountData,
              totalPieAmount,
            });
          }
        })
        .catch((err) => {
          console.log("Error in Api ", JSON.stringify(err));
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
            } else if (err && err.status === 400) {
              if (err.data && err.data.message) {
                Swal.fire("Cannot search. " + err.data.message);
              }
            }
          this.setState({
            isLoading: false,
            totalPieAmount: 0,
          });
        });

      this.setState({
        isLoading: false,
        viewedate,
        viewsdate,
      });
    } else {
      this.setState({
        isLoading: false,
      });
      window.location.href = "/";
    }
  };

  changeSearchParamHandler = (event) => {
    console.log("Search", event.target.value);
    if (event.target.value === "CUSTOM_DATE_RANGE") {
      this.setState({
      searchParam: event.target.value,
      });
    } else {
      this.setState(
        {
          searchParam: event.target.value,
        },
        this.searchBtnPress
      );
    }
  };

  searchBtnPress = () => {
    console.log("Search", this.state.searchParam);
    if (this.state.searchParam.length > 0) {
      this.setState(
        {
          isSearchBtnPress: true,
          activePage: 1,
          isLoading: true,
        },
        this.getData
      );
    }
  };

  render() {
    if (Object.keys(userDetails).length <= 0) {
      userDetails = this.state.userDetails;
    }

    let barData = this.state.barDataGoogle;
    let pieData = this.state.pieDataGoogle;
    let pieAmount = this.state.pieAmountData;
    let counter = this.state.counter;
    let searchParam = this.state.searchParam;
    console.log(counter);

    return (
      <Layout history={this.props.history}>
        <div className="content-wrapper">
        <div className="area-cont-head d-flex justify-content-between">
        <h4>My Receivables</h4>

          <div className="form-group row TablerightInfo">
              <label for="" className="col-sm-4 col-form-label">
                <span>Select Month</span>
              </label>
              <div className="col-sm-6">
                <select
                  onChange={(event) => this.changeSearchParamHandler(event)}
                  value={this.state.searchParam}
                  className="form-control"
                >
                    {this.state.filterList.map((choice, i) => (
                      <option key={choice.id} value={choice.id}>
                        {choice.name}
                      </option>
                    ))}
                </select>
              </div>
          </div>
        </div>

        <div className="formSection">
          {searchParam === "CUSTOM_DATE_RANGE" ? (
              <div className="form-group row">
                  <label for="" className="col-sm-2 col-form-label">
                    From Date:
                  </label>
                  <div className="col-sm-4 d-flex">
                  {searchParam === "CUSTOM_DATE_RANGE" ? (
                    <Datetime
                      readonly
                      name="startdate"
                      utc={true}
                      timeFormat={false}
                      className="search-report-date col-8 pl-0"
                      closeOnSelect={true}
                      dateFormat="DD/MM/YYYY"
                      inputProps={{ placeholder: "Start Date", readOnly: true }}
                      onChange={(date) => this.changeStartDateHandler(date)}
                      value={
                        this.state.viewsdate
                          ? moment(this.state.viewsdate).format("DD/MM/YYYY")
                          : ""
                      }
                    />
                  ) : (
                    <input
                      type="text"
                      value={
                        this.state.viewsdate
                          ? moment(this.state.viewsdate).format("DD/MM/YYYY")
                          : ""
                        }
                        className="form-control"
                        disabled
                      />
                      )}
                  </div>

                  <label for="" className="col-sm-2 col-form-label">
                    To Date:
                  </label>
                  <div className="col-sm-4 d-flex">
                  {searchParam === "CUSTOM_DATE_RANGE" ? (
                      <Datetime
                        readonly
                        name="enddate"
                        utc={true}
                        timeFormat={false}
                        className="search-report-date col-8 pl-0"
                        closeOnSelect={true} 
                        dateFormat="DD/MM/YYYY"
                        inputProps={{ placeholder: "End Date", readOnly: true }}
                        onChange={(date) => this.changeEndDateHandler(date)}
                        value={
                          this.state.viewedate
                            ? moment(this.state.viewedate).format("DD/MM/YYYY")
                            : ""
                        }
                      />
                      ) : (
                        <input
                          type="text"
                          value={
                            this.state.viewedate
                              ? moment(this.state.viewedate).format("DD/MM/YYYY")
                              : ""
                          }
                          className="form-control"
                          disabled
                        />
                      )}
                      {/* <input name="enddate" type="date" placeholder="End Date" /> */}
                      &nbsp; &nbsp;
                      {searchParam === "CUSTOM_DATE_RANGE" ? (
                          <button
                            className="btn btn-primary btn-flat "
                            onClick={this.searchBtnPress}
                          >
                            Submit
                          </button>
                      ) : null}
                  </div>
              </div>
            ) : null}
          </div>

          <div className="">            
            <div className="area-cont"> 
                          <div className="row cardBox">
                            <div className="col-md-3">
                              <div className="dashboardBox-one">
                              <img src={boxOne} />
                              <div>
                              <span>{counter && counter[0] ? counter[0][1] : 0}</span>
                              <p>Amount Receivable</p>
                              </div>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="dashboardBox-two">
                              <img src={boxTwo} /> 
                              <div>
                              <span>{counter && counter[1] ? counter[1][1] : 0}</span>
                              <p>Payment Settled</p>
                              </div>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="dashboardBox-three">
                              <img src={boxThree} />
                              <div>
                              <span>{counter && counter[2] ? counter[2][1] : 0}</span>
                              <p>Payment Pending</p>
                              </div>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="dashboardBox-four">
                              <img src={boxFour} />
                              <div>
                              <span>{counter && counter[3] ? counter[3][1] : 0}</span>
                              <p>Number of Consultations</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="row chartBoxWrapper">                     
                        <div className="col-md-6">
                          <div className="chartBox">
                          {/* <div className="canvus-side-head">
                            <p>No. Of Tasks</p>
                          </div> */}
                          <div className="canvus-area">
                            <Chart
                                // width={"100%"}
                                height={"300px"}
                                chartType="BarChart"
                                loader={<div>Loading Chart</div>}
                                data={barData}
                                options={{         
                                  title: "Payment Status",                         
                                  width: "100%",
                                  height: 300,
                                  margin: "0 auto",
                                  colors: ["#B3DAF8", "#15cda8", "#ff5959"],
                                  // bar: { groupWidth: '90%' },
                                  legend: { position: "none" },   
                                  annotations: {
                                    alwaysOutside: false,
                                      textStyle: {
                                        fontSize: 14,
                                        color: "#000",
                                        auraColor: "none",
                                      },
                                    },                               
                                }}
                                className={"reddyTaskDistribution"}
                                // For tests
                                rootProps={{ "data-testid": "2" }}
                                chartEvents={[
                                  {
                                    eventName: "select",
                                    callback({ chartWrapper }) {
                                      let selected = chartWrapper
                                        .getChart()
                                        .getSelection();
                                      let selectedGraph = 0;
                                      let barGraph = "";
                                      if (selected != "") {
                                        selectedGraph = 15;

                                        barGraph = `${selected[0].row},${selected[0].column}`;
                                        let selTab = selected[0].column;
                                      }
                                    },
                                  },
                                ]}
                              />
                          </div>
                          </div>
                          </div>
                                              
                          <div className="col-md-3">
                          <div className="chartBox">
                          <p className="chart-heading">Claims Status</p>
                          <div className="analytics-moudle-chart">
                            <Chart
                                //width={'100%'}
                                //height={'200px'}
                                chartType="PieChart"
                                loader={<div>Loading Chart</div>}
                                data={pieData}
                                options={{
                                  chartArea: { width: "100%" },
                                  pieHole: 0.65,
                                  sliceVisibilityThreshold: 0,
                                  legend: { position: "none" },
                                  colors: ["#15cda8", "#faea3e", "#ff99cc"],
                                  pieSliceText: "none",
                                }}
                                rootProps={{ "data-testid": "3" }}
                                chartEvents={[
                                  {
                                    eventName: "select",
                                    callback({ chartWrapper }) {
                                      let selected = chartWrapper
                                        .getChart()
                                        .getSelection();
                                      let selectedGraph = 0;

                                      if (selected != "") {
                                        if (selected[0].row === 0) {
                                          selectedGraph = 7;
                                        } else if (selected[0].row === 1) {
                                          selectedGraph = 8;
                                        } else if (selected[0].row === 2) {
                                          selectedGraph = 19;
                                        }
                                      }
                                    },
                                  },
                                ]}
                              />
                            <div className="chart-count">
                                {(this.state.totalPieData).toFixed()}
                                <span>Total</span>
                            </div>
                          </div>
                          <ul className="chart-description">
                            <li>
                              <span
                                style={{ backgroundColor: "#15cda8" }}
                              ></span>
                              Pending Claim
                            </li>
                            <li>
                              <span
                                style={{ backgroundColor: "#faea3e" }}
                              ></span>
                              Credited Claim
                            </li>
                            <li>
                              <span
                                style={{ backgroundColor: "#ff99cc" }}
                              ></span>
                              Rejected Claim
                            </li>
                          </ul>
                        </div>
                        </div>

                        <div className="col-md-3">
                          <div className="chartBox">
                          <p className="chart-heading">Claims Amount</p>
                          <div className="analytics-moudle-chart">
                            <Chart
                                //width={'100%'}
                                //height={'200px'}
                                chartType="PieChart"
                                loader={<div>Loading Chart</div>}
                                data={pieAmount}
                                options={{
                                  chartArea: { width: "100%" },
                                  pieHole: 0.65,
                                  sliceVisibilityThreshold: 0,
                                  legend: { position: "none" },
                                  colors: ["#15cda8", "#faea3e", "#f8ff3b"],
                                  pieSliceText: "none",
                                }}
                                rootProps={{ "data-testid": "3" }}
                                chartEvents={[
                                  {
                                    eventName: "select",
                                    callback({ chartWrapper }) {
                                      let selected = chartWrapper
                                        .getChart()
                                        .getSelection();
                                      let selectedGraph = 0;

                                      if (selected != "") {
                                        if (selected[0].row === 0) {
                                          selectedGraph = 7;
                                        } else if (selected[0].row === 1) {
                                          selectedGraph = 8;
                                        } else if (selected[0].row === 2) {
                                          selectedGraph = 19;
                                        }
                                      }
                                    },
                                  },
                                ]}
                              />
                            <div className="chart-count">
                                {(this.state.totalPieAmount).toFixed(2)}
                                <span>Total</span>
                            </div>
                          </div>

                          <ul className="chart-description">
                            <li>
                              <span style={{ backgroundColor: "#15cda8" }}></span>
                              Pending Claims Amount
                            </li>
                            <li>
                              <span style={{ backgroundColor: "#faea3e" }}></span>
                              Credited Claims Amount
                            </li>                            
                            <li></li>
                          </ul>
                        </div>
                        </div>
               </div>
                  </div>
                  </div>
                
              {this.state.isLoading && <ModalLoader />}            
        </div>
      </Layout>
    );
  }
}

export default Recievables;
