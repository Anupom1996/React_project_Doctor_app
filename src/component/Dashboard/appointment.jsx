import React, { Component } from "react";
import { Link } from "react-router-dom";
import AXIOS from "axios";
import BASICAPI from "../../shared/axios";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import moment from "moment";
import "react-datetime/css/react-datetime.css";
import ModalLoader from "../Loader/loader";
import Layout from "../Layout/layout";
import doclogo from "../../assets/images/profile-img.png";

const axiosVal = {
  instanceAxios: null,
};

let userDetails = {};

class Appointment extends Component {
  state = {
    isLoading: true,
    userDetails: [],
    listactivePage: 0,
    listsearchParam: "",
    listsortParam: { field: "", order: "" },
    listisSearchBtnPress: false,
    listsortVal: 1,
    listviewsdate: '',
    listviewedate: ''
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
    window.scrollTo(0, 0);
    this.fetchUserDetails();
  }

  fetchUserDetails = async () => {
    let listactivePage = 1;
    let listsearchParam = "";
    let listsortParam = { field: "", order: "" };
    let listisSearchBtnPress = false;
    let listsortVal = 1;
    let listviewsdate = '';
    let listviewedate = '';

    let userDetails = [];
    let productId = null;
    if (this.props.match.params.id) {
        productId = this.props.match.params.id;
    }

    if (this.props.location.tagDetails && this.props.location.tagDetails !== null) {
      listactivePage = this.props.location.tagDetails.activePage;
      listsearchParam = this.props.location.tagDetails.searchParam ;
      listsortParam = this.props.location.tagDetails.sortParam;
      listisSearchBtnPress = this.props.location.tagDetails.isSearchBtnPress;
      listsortVal = this.props.location.tagDetails.sortVal;
      listviewsdate = this.props.location.tagDetails.viewsdate;
      listviewedate = this.props.location.tagDetails.viewedate;
    }

    if (productId && productId !== null) {
        await axiosVal.instanceAxios.get("/doctor-app/appointment-detail?appointmentId="+productId)
        .then((res) => {
            if (res.status === 200) {
            let detail = res.data;
            
            this.setState({
                userDetails: detail,
                isLoading: false,
                listactivePage,
                listsearchParam,
                listsortParam,
                listisSearchBtnPress,
                listsortVal,
                listviewsdate,
                listviewedate
            });
            }
        })
        .catch((err) => {
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
                localStorage.clear();
                window.location.href = "/";
                });
            }
            this.setState({
              isLoading: false,
              listactivePage,
              listsearchParam,
              listsortParam,
              listisSearchBtnPress,
              listsortVal,
              listviewsdate,
              listviewedate
            });
        });
    } else {
        this.setState({
          isLoading: false,
        });
        this.props.history.push("/dashboard");
    }
  };

  render() {

    if (Object.keys(userDetails).length <= 0 ) {
      userDetails  = this.state.userDetails;
    }

    const detail = this.state.userDetails;

    return (
      <Layout history={this.props.history}>
        <div className="content-wrapper">
                  <div className="">
                    
                    <div className="area-cont">
                    <div className="profileDetailsBox">
                      <div className="area-cont-head d-flex justify-content-between">
                        <h4 style={{ fontSize: '24px' }}>Appointment Detail</h4>
                        
                      </div>
                      <div className="row profileDetailsSec">
                        <div className="col-md-6">
                          <table className="table">
                              <tbody>
                                  <tr>
                                    <td style={{ width: "200px", borderBottom: "1px solid #E4E4E4"}}>Svaas Appointment Id:{" "}</td>
                                    <td style={{ textAlign: "left", borderBottom: "1px solid #E4E4E4"}}>{detail.svassAppointmentId}</td>
                                  </tr>
                                  <tr>
                                    <td style={{ width: "200px", borderBottom: "1px solid #E4E4E4"}}>Patient Name:{" "}</td>
                                    <td style={{ textAlign: "left", borderBottom: "1px solid #E4E4E4"}}>{detail.patientName}</td>
                                  </tr>
                                  <tr>
                                    <td style={{ width: "200px", borderBottom: "1px solid #E4E4E4"}}>Insurance Id:{" "}</td>
                                    <td style={{ textAlign: "left", borderBottom: "1px solid #E4E4E4"}}>{detail.opdId}</td>
                                  </tr>
                                  <tr>
                                    <td style={{ width: "200px", borderBottom: "1px solid #E4E4E4"}}>Appointment Date:{" "}</td>
                                    <td style={{ textAlign: "left", borderBottom: "1px solid #E4E4E4"}}>{detail.appointmentDate && detail.appointmentDate !== "" ? 
                                          moment(detail.appointmentDate).format('DD-MM-YYYY')
                                      : null}</td>
                                  </tr>
                              </tbody>
                          </table>
                            {/* <li>
                              <span>Patient Name :</span> 
                              <span>{detail.patientName}</span>
                            </li>
                            <li>
                              <span>Insurance Id  :</span>{" "}
                              <span>{detail.opdId}</span>
                            </li>
                            <li>
                              <span>Appointment Date :</span> 
                              <span>{detail.appointmentDate && detail.appointmentDate !== "" ? 
                                  moment(detail.appointmentDate).format('DD-MM-YYYY')
                              : null}</span>
                            </li>
                          </ul> */}
                        </div>
                        <div className="col-md-6">
                          <table className="table">
                              <tbody>
                                <tr>
                                  <td style={{ width: "200px", borderBottom: "1px solid #E4E4E4"}}>Payout status:{" "}</td>
                                  <td style={{ textAlign: "left", borderBottom: "1px solid #E4E4E4"}}>{detail.payoutStatus}</td>
                                </tr>
                                <tr>
                                  <td style={{ width: "200px", borderBottom: "1px solid #E4E4E4"}}>Invoice Number:{" "}</td>
                                  <td style={{ textAlign: "left", borderBottom: "1px solid #E4E4E4"}}>{detail.invoiceNumber}</td>
                                </tr>
                                <tr>
                                  <td style={{ width: "200px", borderBottom: "1px solid #E4E4E4"}}>Appointment Type:{" "}</td>
                                  <td style={{ textAlign: "left", borderBottom: "1px solid #E4E4E4"}}>{detail.appointmentType}</td>
                                </tr>
                                <tr>
                                  <td style={{ width: "200px", borderBottom: "1px solid #E4E4E4"}}>Insurance Company:{" "}</td>
                                  <td style={{ textAlign: "left", borderBottom: "1px solid #E4E4E4"}}>{detail.insuranceCompany}</td>
                                </tr>
                                {/* <li>
                                  <span>Payout status :</span>{" "}
                                  <span>{detail.payoutStatus}</span>
                                </li>
                                <li>
                                  <span>Invoice Number :</span>{" "}
                                  <span>{detail.invoiceNumber}</span>
                                </li>
                                <li>
                                  <span>Appointment Type :</span>{" "}
                                  <span>{detail.appointmentType}</span>
                                </li>
                                <li>
                                  <span>Insurance Company :</span> 
                                  <span>{detail.insuranceCompany}</span>
                                </li> */}
                              </tbody>
                          </table>
                        </div>
                      </div>
                      <br /> <br />
                      <div className="area-cont-head d-flex justify-content-between">
                        <h4 style={{ fontSize: '24px' }}>Transaction Detail</h4>                        
                      </div>
                      <div className="row profileDetailsSec">
                        <div className="col-md-6">
                          <table className="table">
                            <tbody>
                              <tr>
                                <td style={{ width: "200px", borderBottom: "1px solid #E4E4E4"}}>Consultation Fees:{" "}</td>
                                <td style={{ textAlign: "left", borderBottom: "1px solid #E4E4E4"}}>
                                  <div className="col-md-6" style={{ textAlign: "right"}}>
                                  {!detail.consultaionFee || detail.consultaionFee === null ? "" : detail.consultaionFee.toFixed(2)}
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ width: "200px", borderBottom: "1px solid #E4E4E4"}}>Payable by User:{" "}</td>
                                <td style={{ textAlign: "left", borderBottom: "1px solid #E4E4E4"}}>
                                  <div className="col-md-6" style={{ textAlign: "right"}}>
                                  {!detail.payableByInsuranceUser || detail.payableByInsuranceUser === null ? "0.00" : detail.payableByInsuranceUser.toFixed(2)}
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ width: "200px", borderBottom: "1px solid #E4E4E4"}}>Payable by Insurance:{" "}</td>
                                <td style={{ textAlign: "left", borderBottom: "1px solid #E4E4E4"}}>
                                  <div className="col-md-6" style={{ textAlign: "right"}}>
                                  {!detail.payableByInsuranceCompany || detail.payableByInsuranceCompany === null ? "0.00" : detail.payableByInsuranceCompany.toFixed(2)}
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ width: "200px", borderBottom: "1px solid #E4E4E4"}}>Other Charges:{" "}</td>
                                <td style={{ textAlign: "left", borderBottom: "1px solid #E4E4E4"}}>
                                  <div className="col-md-6" style={{ textAlign: "right"}}>
                                    {!detail.otherCharges || detail.otherCharges === null ? "0.00" : detail.otherCharges.toFixed(2)}
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ width: "200px", borderBottom: "1px solid #E4E4E4"}}>Total Fees:{" "}</td>
                                <td style={{ textAlign: "left", borderBottom: "1px solid #E4E4E4"}}>
                                  <div className="col-md-6" style={{ textAlign: "right"}}>
                                  {!detail.totalFees || detail.totalFees === null ? "0.00" : detail.totalFees.toFixed(2)}
                                  </div>
                                </td>
                              </tr>
                                
                              {/* <li>
                                <span>Consultation Fees:</span> 
                                <span>{!detail.consultaionFee || detail.consultaionFee === null ? "" : detail.consultaionFee.toFixed(2)}</span>
                              </li>
                              <li>
                                <span>Payable by User:</span> 
                                <span>{!detail.payableByInsuranceUser || detail.payableByInsuranceUser === null ? 0 : detail.consultaionFee.toFixed(2)}</span>
                              </li>
                              <li>
                                <span>Payable by Insurance:</span> 
                                <span>{!detail.payableByInsuranceCompany || detail.payableByInsuranceCompany === null ? 0 : detail.payableByInsuranceCompany.toFixed(2)}</span>
                              </li>
                              <li>
                                <span>Other Charges:</span> 
                                <span>{!detail.otherCharges || detail.otherCharges === null ? 0 : detail.otherCharges.toFixed(2)}</span>
                              </li>
                              <li>
                                <span>Total Fees:</span>
                                <span>{!detail.totalFees || detail.totalFees === null ? 0 : detail.totalFees.toFixed(2)}</span>                              
                              </li> */}
                              {/* <li>
                                <span>Payout Amount :</span>{" "}
                                <span>{detail.payoutAmount}</span>
                              </li> */}
                              {/* <li>
                                <span>Digital Platform fees :</span>{" "}
                                <span>{detail.digitalPlatformFees}</span>
                              </li>
                              <li>
                                <span>GST Digital Platform fees :</span>{" "}
                                <span>{detail.gstDigitalPlatformFees}</span>
                              </li>
                              <li>
                                <span>Marketing Fees :</span>{" "}
                                <span>{detail.marketingFees}</span>
                              </li>
                              <li>
                                <span>GST Marketing Fees :</span>{" "}
                                <span>{detail.gstMarketingFees}</span>
                              </li> */}
                            </tbody>
                          </table>
                        </div>
                        <div className="col-md-6">
                          <table className="table">
                            <tbody>
                              <tr>
                                <td style={{ width: "200px", borderBottom: "1px solid #E4E4E4"}}>Transaction Amount :{" "}</td>
                                <td style={{ textAlign: "left", borderBottom: "1px solid #E4E4E4"}}>
                                  <div className="col-md-6" style={{ textAlign: "right"}}>
                                  {!detail.transactionAmountSettle || detail.transactionAmountSettle === null ? "" : detail.transactionAmountSettle.toFixed(2)}
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ width: "200px", borderBottom: "1px solid #E4E4E4"}}>TDS u/s 194-O:{" "}</td>
                                <td style={{ textAlign: "left", borderBottom: "1px solid #E4E4E4"}}>
                                  <div className="col-md-6" style={{ textAlign: "right"}}>
                                  {!detail.tdsus194O || detail.tdsus194O === null ? "0.00" : detail.tdsus194O.toFixed(2)}
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ width: "200px", borderBottom: "1px solid #E4E4E4"}}>Commission (inclusive of GST 18%):{" "}</td>
                                <td style={{ textAlign: "left", borderBottom: "1px solid #E4E4E4"}}>
                                  <div className="col-md-6" style={{ textAlign: "right"}}>
                                  {!detail.commissionAmountSettle || detail.commissionAmountSettle === null ? "0.00" : detail.commissionAmountSettle.toFixed(2)}
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ width: "200px", borderBottom: "1px solid #E4E4E4"}}>Net Payout Amount:{" "}</td>
                                <td style={{ textAlign: "left", borderBottom: "1px solid #E4E4E4"}}>
                                  <div className="col-md-6" style={{ textAlign: "right"}}>
                                  {!detail.netPayoutAmount || detail.netPayoutAmount === null ? "" : detail.netPayoutAmount.toFixed(2)}
                                  </div>
                                </td>
                              </tr>
                              
                              {/* <li>
                                <span>Transaction Amount :</span> 
                                <span>{detail.transactionAmountSettle}</span>
                              </li>
                              <li>
                                <span>GST :</span> 
                                <span>{detail.totalGstAmountSettle}</span>
                              </li>
                              <li>
                                <span>Total Transaction Amount :</span> 
                                <span>{detail.totalTransactionAmountSettle}</span>
                              </li> */}
                              {/* <li>
                                <span>TDS u/s 194-O :</span> 
                                <span>{detail.tdsus194O}</span>
                              </li>
                              <li>
                                <span>Commission (including 18% GST) :</span> 
                                <span>{detail.commissionAmountSettle}</span>
                              </li> */}
                              {/* <li>
                                <span>GST Commission Fees :</span> 
                                <span>{detail.commissionGSTAmountSettle}</span>
                              </li> */}
                              {/* <li>
                                <span>TDS u/s 194H :</span> 
                                <span>{detail.tdsus194H}</span>
                              </li> */}
                              {/* <li>
                                <span>Net Payout :</span> 
                                <span>{detail.priceToDrlSettle}</span>
                              </li> */}
                              {/* <li>
                                <span>TCS :</span> 
                                <span>{detail.tcs}</span>
                              </li>
                              <li>
                                <span>Net Payout Amount :</span> 
                                <span>{detail.netPayoutAmount}</span>
                              </li> */}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="d-flex button-area">
                        <Button
                          className={`btn btn-danger btn-block `}
                          // type="submit"
                          onClick={() =>
                            this.props.history.push({
                              pathname: "/dashboard" ,
                              tagDetails: {
                                listactivePage: this.state.listactivePage,
                                listsearchParam: this.state.listsearchParam,
                                listsortParam: this.state.listsortParam,
                                listisSearchBtnPress: this.state.listisSearchBtnPress,
                                listsortVal: this.state.listsortVal,
                                listviewsdate: this.state.listviewsdate,
                                listviewedate: this.state.listviewedate
                              }
                            })
                          }
                        >
                          Cancel
                        </Button>
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

export default Appointment;
