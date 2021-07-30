import React, { Component } from "react";
import { Link } from "react-router-dom";
import Pagination from "react-js-pagination";
import Datetime from "react-datetime";
import { Row, Col, Table, OverlayTrigger, Tooltip } from "react-bootstrap";
import AXIOS from "axios";
import BASICAPI from "../../shared/axios";
import Layout from "../Layout/layout";
import Swal from "sweetalert2";
import moment from "moment";
import ModalLoader from "../ModalView/modalLoader";
import { Scrollbars } from 'react-custom-scrollbars';

const axiosVal = {
  instanceAxios: null,
};
const tempaxiosVal = {
  instanceAxios: null,
};

const singlePageLimit = 10;

class Dashboard extends Component {
  state = {
    filterList: [],
    productList: null,
    searchParam: "",
    sortParam: {
      field: "",
      order: "",
    },
    sortVal: 1,
    isLoading: true,
    count: 0,
    activePage: 1,
    isSearchBtnPress: false,
    sdate: '',
    viewsdate: '',
    viewedate: '',
    edate: '',
    updateDate: '',
    updateTime: ''
  }

  constructor(props) {
    super(props);
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
  
  truncate = (str) => {
    return str.length > 15 ? str.substring(0, 15) + "..." : str;
  }

  getData = async () => {
    // let access = JSON.parse(localStorage.getItem("access"));
    let listactivePage = this.state.activePage;
    let listsearchParam = this.state.searchParam;
    let listsortParam = this.state.sortParam;
    let listisSearchBtnPress = this.state.isSearchBtnPress;
    let listsortVal = this.state.sortVal;
    let listviewsdate = this.state.viewsdate;
    let listviewedate = this.state.viewedate;

    if (this.props.location.tagDetails && this.props.location.tagDetails !== null) {
      listactivePage = this.props.location.tagDetails.listactivePage;
      listsearchParam = this.props.location.tagDetails.listsearchParam;
      listsortParam = this.props.location.tagDetails.listsortParam;
      listisSearchBtnPress = this.props.location.tagDetails.listisSearchBtnPress;
      listsortVal = this.props.location.tagDetails.listsortVal;
      listviewsdate = this.props.location.tagDetails.listviewsdate;
      listviewedate = this.props.location.tagDetails.listviewedate;
      this.props.location.tagDetails = null;
    }

    await this.setState({
      isLoading: true,
      activePage: listactivePage,
      searchParam: listsearchParam,
      sortParam: listsortParam,
      isSearchBtnPress: listisSearchBtnPress,
      sortVal: listsortVal,
      viewsdate: listviewsdate,
      viewedate: listviewedate
    });

    if ( localStorage.getItem("isLoggedIn") ) {

      let searchString = "";
      let sortString = "";
      let pageString = "";
      let dateString = "";
      let viewsdate = "";
      let viewedate = "";

      if (this.state.viewedate === '' && this.state.viewsdate === '' && this.state.searchParam === '') {
        let sday = moment().startOf('month');
        let eday = moment();

        viewsdate = sday.format('MM/DD/YYYY');
        viewedate = eday.format('MM/DD/YYYY');
      } else if (this.state.searchParam === "CUSTOM_DATE_RANGE") {
        // let formatSDate = this.state.viewsdate !== '' ? new Date(this.state.viewsdate).toISOString() : '';
        // let formatEDate = this.state.viewedate !== '' ? new Date(this.state.viewedate).toISOString() : '';
        let formatSDate = this.state.viewsdate !== '' ? moment(this.state.viewsdate).format('YYYY-MM-DD') : '';
        let formatEDate = this.state.viewedate !== '' ? moment(this.state.viewedate).format('YYYY-MM-DD') : '';
        dateString += "&startDate="+formatSDate+"&endDate="+formatEDate ;
        viewsdate = formatSDate;
        viewedate = formatEDate;
      } else {
        if (this.state.searchParam === "CURRENT_MONTH" || this.state.searchParam === "") {
          let sday = moment().startOf('month');
          let eday = moment();

          viewsdate = sday.format('MM/DD/YYYY');
          viewedate = eday.format('MM/DD/YYYY');
        } else if (this.state.searchParam === "LAST_MONTH") {
          let sday = moment().subtract(1,'months');
          let eday = moment();

          viewsdate = sday.format('MM/DD/YYYY');
          viewedate = eday.format('MM/DD/YYYY');
        } else if (this.state.searchParam === "LAST_3_MONTH") {
          let sday = moment().subtract(3,'months');
          let eday = moment();

          viewsdate = sday.format('MM/DD/YYYY');
          viewedate = eday.format('MM/DD/YYYY');
        } else if (this.state.searchParam === "LAST_6_MONTH") {
          let sday = moment().subtract(6,'months');
          let eday = moment();

          viewsdate = sday.format('MM/DD/YYYY');
          viewedate = eday.format('MM/DD/YYYY');
        } else if (this.state.searchParam === "CURR_FIN_YEAR") {
          if (moment().quarter() == 1) {
            let sday = moment().subtract(1,'year').month('April').startOf('month');
            let eday = moment().month('March').endOf('month');
    
            viewsdate = sday.format('MM/DD/YYYY');
            viewedate = eday.format('MM/DD/YYYY');
          } else {
            let sday = moment().month('April').startOf('month');
            let eday = moment().add(1,'year').month('March').endOf('month');
    
            viewsdate = sday.format('MM/DD/YYYY');
            viewedate = eday.format('MM/DD/YYYY');
          }
        } else if (this.state.searchParam === "LAST_FIN_YEAR") {
          if (moment().quarter() == 1) {
            let sday = moment().subtract(2,'year').month('April').startOf('month');
            let eday = moment().subtract(1,'year').month('March').endOf('month');
    
            viewsdate = sday.format('MM/DD/YYYY');
            viewedate = eday.format('MM/DD/YYYY');
          } else {
            let sday = moment().subtract(1,'year').month('April').startOf('month');
            let eday = moment().month('March').endOf('month');
    
            viewsdate = sday.format('MM/DD/YYYY');
            viewedate = eday.format('MM/DD/YYYY');
          }
        }
      }

      this.setState({
        searchParam: this.state.isSearchBtnPress ? this.state.searchParam : "",
        viewsdate,
        viewedate
      });

      if (this.state.activePage > 0) {
        pageString += "&pageNo=" + (this.state.activePage - 1);
      }
      if (this.state.searchParam !== "") {
        searchString += "&filter=" + (this.state.isSearchBtnPress ? this.state.searchParam : "");
      } else {
        searchString += "&filter=CURRENT_MONTH";
      }
      if (
        this.state.sortParam.field !== "" &&
        this.state.sortParam.order !== ""
      ) {
        sortString +=
          "&sortBy=" +
          this.state.sortParam.field +
          "&sortOrder=" +
          this.state.sortParam.order;
      }

      await axiosVal.instanceAxios.get( "/doctor-app/appointment-list?pageSize=" + singlePageLimit + pageString + searchString + sortString + dateString)
        .then((res) => {
          if (res.status === 200) {
            if (res.data.total > 0) {
              let prodList = null;
              let toolTip = <Tooltip id="button-tooltip"> Click on Eye symbol to view details </Tooltip>

              prodList = res.data.entries.map((product, index) => {
                return (
                  <tr key={index}>
                    {/* <td>
                      <OverlayTrigger 
                        placement="left" delay={{ show: 250, hide: 400 }} 
                        overlay={
                          <Tooltip id="button-tooltip" style={{ position: "absolute", left: "100%"}}>
                            {product.svaasPatientId}
                          </Tooltip>
                        } 
                        trigger={['hover', 'focus']} rootClose >
                        <span style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>
                          {this.truncate(product.svaasPatientId)}
                        </span>
                      </OverlayTrigger>
                    </td> */}
                    {/* <td>{product.svaasDoctorId}</td>
                    <td>{product.hplixDoctorId}</td> */}
                    <td>{product.patientName}</td>
                    {/* <td>{product.opdId}</td> */}
                    <td>{product.hplxAppointmentId}</td>
                    <td>{product.clinicName}</td>
                    {/* <td>{product.primaryComplain}</td> */}
                    <td>
                      {moment(new Date(product.appointmentDate)).format("DD-MM-YYYY")}
                    </td>
                    {/* <td>{product.tds}</td>                     */}
                    <td>{!product.consultationFees || product.consultationFees === null ? "" : product.consultationFees.toFixed(2)}</td>
                    {/* <td>{product.consultationType}</td> */}
                    <td>{product.appointmentType}</td>
                    {/* <td>{product.payableByConsumer ? product.payableByConsumer : 0}</td>
                    <td>{product.payableByInsurance ? product.payableByInsurance : 0}</td>
                    <td>{product.payoutAmount}</td>
                    <td>{product.reconciliationStatus}</td> */}
                    {/* <td>{product.invoiceNumber}</td> */}
                    {/* <td>{product.digitalPlatformFees}</td>
                    <td>{product.gstDigitalPlatformFees}</td>
                    <td>{product.marketingFees}</td>
                    <td>{product.gstMarketingFees}</td> */}
                    <td>{!product.netPayoutAmount || product.netPayoutAmount === null ? "" : product.netPayoutAmount.toFixed(2)}</td>
                    <td>{product.payoutStatus}</td>
                    
                    <td 
                    // style={{ textAlign: "center" }}
                    >
                        {/* <Link to="#" >
                          <img src={require("../../assets/images/support_icon.png")} alt="Support Img" 
                            style={{width: '25px', marginLeft: '15px' }}/>
                        </Link> */}
                        <Link
                          to={{
                            pathname: "/appointment/" + product.appointmentid,
                            tagDetails: {
                              activePage: this.state.activePage,
                              searchParam: this.state.searchParam,
                              sortParam: this.state.sortParam,
                              isSearchBtnPress: this.state.isSearchBtnPress,
                              sortVal: this.state.sortVal,
                              viewsdate: this.state.viewsdate,
                              viewedate: this.state.viewedate,
                            }
                          }}
                        >
                          <i className="fa fa-eye" aria-hidden="true" style={{ fontSize: '15px', marginLeft: '15px', verticalAlign: 'middle'}}></i>{" "}
                        </Link>                                            
                    </td>
                  </tr>
                );
              });
              let curDate = !res.data.lastUpdatedDate || res.data.lastUpdatedDate === '' || res.data.lastUpdatedDate === null ? "" : res.data.lastUpdatedDate;

              this.setState({
                productList: prodList,
                count: res.data.total,
                updateDate: curDate === "" ? "" : moment(curDate).format('DD-MM-YYYY'),
                updateTime: curDate === "" ? "" : moment(curDate).format('HH:mm')
              });
            } else {
              this.setState({
                productList: (
                  <tr>
                    <td colSpan="10">No Appointment Found</td>
                  </tr>
                ),
                count: res.data.total,
              });
            }
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
            if (err.data && err.data.message ) {
              Swal.fire("Cannot search. " + err.data.message);
            }
          } 
          this.setState({
            isLoading: false,
          });
        });

      this.setState({
        isLoading: false,
        viewedate,
        viewsdate
      });
    } else {
      this.setState({
        isLoading: false,
      });
      window.location.href = "/";
    }
  }

  changeSearchParamHandler = (event) => {
    console.log("Search", event.target.value)
    if (event.target.value === 'CUSTOM_DATE_RANGE') {
      this.setState({
        searchParam: event.target.value,
      });
    } else {
      this.setState({
        searchParam: event.target.value,
      }, this.searchBtnPress);
    }
  }

  searchBtnPress = () => {
    console.log("Search", this.state.searchParam);
    if (this.state.searchParam.length > 0) {
      this.setState({
        isSearchBtnPress: true,
        activePage: 1,
        isLoading: true
      }, this.getData);
    }
  }

  changeSortParamHandler = (e) => {
    console.log("sortVal", e.target.value);
    let newSort = e.target.value;
    const sortValue = this.state.sortParam;

    sortValue.field = 'createdDate';
    
      if (newSort == "1") {
        sortValue.order = "DESC";
      } else {
        sortValue.order = "ASC";
      }
    
    this.setState({
      sortParam: sortValue,
      sortVal: newSort,
      isLoading: true,
    }, this.getData);
    // this.getData();
  }

  handlePageChange = async (pageNumber) => {
    await this.setState({
      activePage: pageNumber,
      isLoading: true,
    });
    this.getData();
  }

  toggleAccordianBtn = (e) => {
    let classAccord = e.target.className;
    let els = document.getElementsByClassName("accordianBtn btn btn-link");
    if (els) {
      while (els[0]) {
        els[0].classList.remove("accordianBtn");
      }
    }
    if (classAccord.indexOf("accordianBtn") > -1) {
      e.target.className = "btn btn-link";
    } else {
      e.target.className = "accordianBtn btn btn-link";
    }
  };

  render() {
    let searchParam = this.state.searchParam;
    
    return (
      <Layout history={this.props.history}>
        <div className="content-wrapper">

            <div className="">

            <div className="form-group row headerformSec">
              <label for="" className="col-sm-2 col-form-label">Select Month</label>
              <div className="col-sm-3">
                <select onChange={(event) => this.changeSearchParamHandler(event)} value={this.state.searchParam} className="form-control">
                  {this.state.filterList.map(
                  (choice, i) => (
                  <option key={choice.id} value={choice.id}>
                  {choice.name}
                  </option>
                  )
                  )}
                </select>
              </div>
              <label for="" className="col-sm-3 col-form-label">No. of Consultation : {this.state.count}</label>
              <label for="" className="col-sm-1 col-form-label">Sort</label>
              <div className="col-sm-3">
                <select onChange={(event) => this.changeSortParamHandler(event)} value={this.state.sortVal}  className="form-control">
                  <option value="1"> Newest to Oldest </option>
                  <option value="2"> Oldest to Newest </option>
                </select>
              </div>

            </div>
            
            {searchParam === "CUSTOM_DATE_RANGE" ? (
            <div className="form-group row headerformSec">
              <label for="" className="col-sm-2 col-form-label">From Date:</label>
              <div className="col-sm-4 d-flex">
                {searchParam === "CUSTOM_DATE_RANGE" ? (
                  <Datetime readonly name="startdate" utc={true} timeFormat={false}
                    className="search-report-date col-8 pl-0"
                    closeOnSelect={true} 
                    dateFormat="DD/MM/YYYY"
                    inputProps={{ placeholder: "Start Date", readOnly: true }}
                    onChange={(date) => this.changeStartDateHandler(date) }
                    value={this.state.viewsdate ? moment(this.state.viewsdate).format("DD/MM/YYYY") : ""}
                  />
                ) : (
                  <input type="text" value={this.state.viewsdate ? moment(this.state.viewsdate).format("DD/MM/YYYY") : ""} className="form-control" disabled />
                )}
              </div>

              <label for="" className="col-sm-2 col-form-label">To Date:</label>
              <div className="col-sm-4 d-flex">
                {searchParam === "CUSTOM_DATE_RANGE" ? (
                  <Datetime readonly name="enddate" utc={true} timeFormat={false}
                    className="search-report-date col-8 pl-0"
                    closeOnSelect={true} 
                    dateFormat="DD/MM/YYYY"
                    inputProps={{ placeholder: "End Date", readOnly: true }}
                    onChange={(date) => this.changeEndDateHandler(date) }
                    value={this.state.viewedate ? moment(this.state.viewedate).format("DD/MM/YYYY") : ""}
                  />
                ) : (
                  <input type="text" value={this.state.viewedate ? moment(this.state.viewedate).format("DD/MM/YYYY") : ""} className="form-control" disabled />
                )}
                {/* <input name="enddate" type="date" placeholder="End Date" /> */}
                &nbsp;
                &nbsp;
                {searchParam === "CUSTOM_DATE_RANGE" ? (
                  <button
                    className="btn btn-primary btn-flat "
                    onClick={this.searchBtnPress}
                  >
                    Submit
                  </button>
                ) : null }
              </div>
            </div>
          ) : null }

              
              <div className="table-container">
                <Scrollbars style={{ width: '100%', height: 400 }}>
                  <Table table table-borderless>
                    <thead className="thead-light">
                      <tr>
                        {/* <th>Svass Patient Id</th> */}
                        {/* <th>SVAAS Doctor ID</th>
                        <th>Hplix Doctor ID</th> */}
                        <th>Patient Name</th>
                        {/* <th>Insurance Id</th> */}
                        <th>Appt Id</th>
                        <th>Clinic Name</th>
                        {/* <th>Primary Complaint</th> */}
                        <th>Apt Date/ Time</th>
                        {/* <th>TDS</th> */}
                        <th>Consultation fees</th>
                        {/* <th>Consultation Type</th> */}
                        <th>Appointment Type</th>
                        {/* <th>Invoice Number</th> */}
                        {/* <th>Digital Platform fees</th>
                        <th>GST Digital Platform fees</th>
                        <th>Marketing Fees</th>
                        <th>GST Marketing Fees</th> */}
                        {/* <th>Con. Fees</th>
                        <th>Payable By User</th>
                        <th>Payable By Insurance</th> */}
                        <th>Net Payout Amount</th>
                        <th>Payout Status</th>
                        
                        <th>
                          View Details
                        </th>

                      </tr>
                    </thead>
                    <tbody>{this.state.productList}</tbody>
                  </Table>
                </Scrollbars>
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
              <div  style={{ padding: '10px 10px', fontSize: '15px'}}>
                {this.state.updateDate === '' ? (
                  <p>
                    ** It may take some time to reflect the latest completed appointments.
                  </p>
                ) : (
                  <p>
                    Note: last updated at {this.state.updateDate === '' ? 'N/A' : this.state.updateDate} {this.state.updateTime === '' ? '' : this.state.updateTime}
                  <br />
                    ** It may take some time to reflect the latest completed appointments.
                  </p>
                )}
              </div>
            </div>
        </div>
      </Layout>
    );
  }
}
export default Dashboard;