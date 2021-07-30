import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

import AutoComplete from "./placesAutocomplete";
import GoogleMap from "./googleMap";

const modalComponent = (props) => {
  const [detailsLocation, setDetailsLocation] = useState({});

  useEffect(() => {
    setDetailsLocation({
      latitude: props.latitude,
      longitude: props.longitude,
    });
  }, []);

  const handleClose = () => {
    props.closeClick();
  };

  const handleSubmitEvent = (values) => {
    // console.log(values, "OK");
    const postValue = { ...values };
    props.saveClick(postValue);
  };

  const newInitialValues = Object.assign(
    {},
    {
      address: props.address,
      latitude: props.latitude,
      longitude: props.longitude,
    }
  );

  const validateStopFlag = Yup.object().shape({
    address: Yup.string()
      .trim()
      .required("Please enter Address")
      .min(2, "Address must be at least 2 characters"),
  });

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

  return (
    <div
      className="form-autopanel"
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
            {props.address.length > 0 ? "Edit Location" : "Add Location"}
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
                            <div className="autoComplete-group">
                              <AutoComplete
                                address={values.address}
                                closeAuComplete={closeAuComplete}
                                setFieldValue={setFieldValue}
                              />
                              {errors.address && touched.address ? (
                                <span className="errorMsg">
                                  {errors.address}
                                </span>
                              ) : null}
                            </div>
                          </div>

                          <div className="form-group">
                            <div
                              className="form-GoogleMap"
                              style={{
                                width: "100%",
                              }}
                            >
                              <GoogleMap detailsLocation={detailsLocation} />
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
