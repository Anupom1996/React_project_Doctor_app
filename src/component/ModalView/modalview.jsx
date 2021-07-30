import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import Datetime from "react-datetime";
import moment from "moment";
import AutoComplete from "./placesAutocomplete";
import GoogleMap from "./googleMap";

const modalComponent = (props) => {
  const [imageFileArray, setImageFileArray] = useState([]);
  const [isPrimary, setPrimary] = useState(false);
  const [detailsLocation, setDetailsLocation] = useState({});

  useEffect(() => {
    if (props.valueprops) {
      setPrimary(props.valueprops.primary);
      setImageFileArray(props.valueprops.clinicPhotos);
      // console.log("handleClose props ---------", props);
      setDetailsLocation({
        latitude: props.valueprops.latitude,
        longitude: props.valueprops.longitude,
      });
    }
  }, []);

  const handleClose = () => {
    // console.log("handleClose ---------");
    props.closeClick();
  };

  const handleSubmitEvent = (values) => {
    // console.log(values, "OK");
    const postValue = {
      ...values,
      editmode: props.valueprops ? true : false,
      clinicPhotos: imageFileArray,
      primary: isPrimary,
    };
    props.saveClick(postValue);
  };

  const newInitialValues = Object.assign(
    {},
    {
      id: props.valueprops ? props.valueprops.id : "",
      name: props.valueprops ? props.valueprops.name : "",
      address: props.valueprops ? props.valueprops.address : "",
      latitude: props.valueprops ? props.valueprops.latitude : "",
      longitude: props.valueprops ? props.valueprops.longitude : "",
      file1: props.valueprops ? "Demo" : "",
      clinicFees: props.valueprops ? props.valueprops.clinicFees : "",
      openingTime: props.valueprops
        ? new Date(
            moment(props.valueprops.openingTime, ["h:mm A"]).format(
              "YYYY-MM-DD hh:mm A"
            )
          )
        : "",

      closingTime: props.valueprops
        ? new Date(
            moment(props.valueprops.closingTime, ["h:mm A"]).format(
              "YYYY-MM-DD hh:mm A"
            )
          )
        : "",
    }
  );

  const closeAuComplete = (argsValue, argsSet) => {
    console.log("argsValue ---------", argsValue);

    if (argsValue && argsValue.lat && argsValue.lng) {
      setDetailsLocation({
        latitude: argsValue.lat,
        longitude: argsValue.lng,
      });
      argsSet("address", argsValue.address);
      argsSet("latitude", argsValue.lat);
      argsSet("longitude", argsValue.lng);
    }
  };

  const validateStopFlag = Yup.object().shape({
    name: Yup.string().required("Please enter Name"),
    // address: Yup.string().required("Please enter Address"),
    address: Yup.string()
      .trim()
      .required("Please enter Address")
      .min(2, "Address must be at least 2 characters"),
    // latitude: Yup.number().required("Please enter Latitude"),
    // longitude: Yup.number().required("Please enter Longitude"),
    file1: Yup.string().required("Please select an image"),
    clinicFees: Yup.number().required("Please enter Clinic Fees"),
    openingTime: Yup.string().required("Please select Opening Time"),
    closingTime: Yup.string()
      .required("Please select Closing Time")
      .test("getter", "Closing Time should be more than Opening Time", function(
        v
      ) {
        const ref = Yup.ref("openingTime");
        console.log(v);
        console.log(this.resolve(ref));
        return v >= this.resolve(ref);
      })
      .test("equal", "Closing Time should be more than Opening Time", function(
        v
      ) {
        const ref = Yup.ref("openingTime");
        return v !== this.resolve(ref);
      }),
  });

  const fileHandler = (event) => {
    // console.log(event.currentTarget.files[0]);
    if (event.target.files[0] !== undefined) {
      if (
        event.target.files[0].type === "image/jpeg" ||
        event.target.files[0].type === "image/png" ||
        event.target.files[0].type === "image/jpg"
      ) {
        //this.setState({ logo: event.target.files[0], logolink: URL.createObjectURL(event.target.files[0]) });

        const imageArray = [...imageFileArray];

        var file = event.currentTarget.files[0];
        var reader = new FileReader();
        var url = reader.readAsDataURL(file);

        reader.onloadend = function(e) {
          imageArray.push({
            imgSrc: [reader.result],
            name: file,
          });
          console.log(imageArray);
          setImageFileArray(imageArray);
        }.bind(this);
      } else {
      }
    }
  };

  return (
    <div
      style={{
        flex: 1,
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        top: 0,
        left: 0,
      }}
    >
      <Modal.Dialog>
        <Modal.Header closeButton onHide={handleClose}>
          <Modal.Title>
            {props.valueprops ? "Edit Clinic" : "Add Clinic"}
          </Modal.Title>
        </Modal.Header>

        <Formik
          initialValues={newInitialValues}
          validationSchema={validateStopFlag}
          onSubmit={handleSubmitEvent}
        >
          {({
            values,
            errors,
            touched,
            isValid,
            isSubmitting,
            setFieldValue,
            setFieldTouched,
            setErrors,
          }) => {
            return (
              <Form>
                <Modal.Body>
                  <div className="contBox box-area">
                    <Row>
                      <Col xs={12} sm={12} md={12}>
                        <div className="gpex position-relative">
                          <div className="form-group">
                            <label>
                              Name
                              <span className="impField">*</span>
                            </label>
                            <Field
                              name="name"
                              type="text"
                              className={`form-control`}
                              placeholder="Enter Name"
                              autoComplete="off"
                            />
                            {errors.name && touched.name ? (
                              <span className="errorMsg">{errors.name}</span>
                            ) : null}
                          </div>
                          <div className="form-group">
                            <label>
                              Address
                              <span className="impField">*</span>
                            </label>
                            {/* <Field
                              name="address"
                              type="text"
                              className={`form-control`}
                              placeholder="Enter Address"
                              autoComplete="off"
                            /> */}
                            <AutoComplete
                              address={values.address}
                              closeAuComplete={closeAuComplete}
                              setFieldValue={setFieldValue}
                            />
                            {errors.address && touched.address ? (
                              <span className="errorMsg">{errors.address}</span>
                            ) : null}
                          </div>
                          <div className="form-group">
                            <div
                              style={{
                                width: "100%",
                              }}
                            >
                              <GoogleMap detailsLocation={detailsLocation} />
                            </div>
                          </div>

                          {/* <div className="form-group">
                            <label>
                              Latitude
                              <span className="impField">*</span>
                            </label>
                            <Field
                              name="latitude"
                              type="number"
                              className={`form-control`}
                              placeholder="Enter Latitude"
                              autoComplete="off"
                            />
                            {errors.latitude && touched.latitude ? (
                              <span className="errorMsg">
                                {errors.latitude}
                              </span>
                            ) : null}
                          </div>
                          <div className="form-group">
                            <label>
                              Longitude
                              <span className="impField">*</span>
                            </label>
                            <Field
                              name="longitude"
                              type="number"
                              className={`form-control`}
                              placeholder="Enter Longitude"
                              autoComplete="off"
                            />
                            {errors.longitude && touched.longitude ? (
                              <span className="errorMsg">
                                {errors.longitude}
                              </span>
                            ) : null}
                          </div> */}

                          <div className="form-group">
                            <label>
                              Clinic Fees
                              <span className="impField">*</span>
                            </label>
                            <Field
                              name="clinicFees"
                              type="number"
                              className={`form-control`}
                              placeholder="Enter Clinic Fees"
                              autoComplete="off"
                            />
                            {errors.clinicFees && touched.clinicFees ? (
                              <span className="errorMsg">
                                {errors.clinicFees}
                              </span>
                            ) : null}
                          </div>

                          <div className="form-group">
                            <label>
                              Opening Time
                              <span className="impField">*</span>
                            </label>
                            <Datetime
                              readonly
                              name="openingTime"
                              utc={false}
                              dateFormat={false}
                              closeOnSelect={true}
                              value={values.openingTime}
                              locale="24-hour clock"
                              inputProps={{
                                placeholder: "Select Opening Time",
                                readOnly: true,
                              }}
                              onChange={(date) => {
                                // this.setState({
                                //   Opening_Time: date,
                                // });
                                setFieldValue("openingTime", date);
                              }}
                            />
                            {errors.openingTime && touched.openingTime ? (
                              <span className="errorMsg">
                                {errors.openingTime}
                              </span>
                            ) : null}
                          </div>

                          <div className="form-group">
                            <label>
                              Closing Time
                              <span className="impField">*</span>
                            </label>
                            <Datetime
                              readonly
                              name="closingTime"
                              utc={false}
                              dateFormat={false}
                              closeOnSelect={true}
                              locale="24-hour clock"
                              value={values.closingTime}
                              inputProps={{
                                placeholder: "Select Closing Time",
                                readOnly: true,
                              }}
                              onChange={(date) => {
                                setFieldValue("closingTime", date);
                              }}
                            />
                            {errors.closingTime && touched.closingTime ? (
                              <span className="errorMsg">
                                {errors.closingTime}
                              </span>
                            ) : null}
                          </div>

                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              name="primary"
                              id="primary"
                              className="custom-control-input"
                              onChange={() => setPrimary(!isPrimary)}
                              checked={isPrimary ? true : false}
                            />
                            <label
                              className="custom-control-label"
                              for="primary"
                            >
                              Primary
                            </label>
                          </div>

                          <div className="form-group">
                            <div className="brwosebtn brwosebtnArea">
                              <label
                                // for="file"
                                htmlFor="file1"
                                className="btna"
                              >
                                + Add photos
                              </label>
                              <input
                                id="file1"
                                name="file1"
                                type="file"
                                className={`form-control`}
                                onChange={(event) => {
                                  console.log("dsssdds");
                                  fileHandler(event);
                                  setFieldValue(
                                    "file1",
                                    event.currentTarget.files[0]
                                  );
                                }}
                                style={{
                                  width: 0.1,
                                  height: 0.1,
                                  opacity: 0,
                                  zIndex: -1,
                                }}
                              />
                              {errors.file1 && touched.file1 ? (
                                <span className="errorMsg">{errors.file1}</span>
                              ) : null}
                            </div>

                            <div className="d-flex upload-image-area">
                              {imageFileArray.map((imgFile, index) => (
                                <img
                                  key={index}
                                  // style={{
                                  //   margin: 10,
                                  //   width: 120,
                                  //   height: 80,
                                  // }}
                                  src={
                                    imgFile.imgSrc
                                      ? imgFile.imgSrc
                                      : imgFile.name
                                  }
                                  alt="Logo"
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="primary" type="submit">
                    Save changes
                  </Button>
                </Modal.Footer>
              </Form>
            );
          }}
        </Formik>
      </Modal.Dialog>
    </div>
  );
};

export default modalComponent;
