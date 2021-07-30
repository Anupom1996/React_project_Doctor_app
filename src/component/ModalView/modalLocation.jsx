import React, { useState } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

const modalComponent = (props) => {
  const handleClose = () => {
    // console.log("handleClose ---------");
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
      latitude: props.latitude ? props.latitude : "",
      longitude: props.longitude ? props.longitude : "",
    }
  );

  const validateStopFlag = Yup.object().shape({
    address: Yup.string()
      .trim()
      .required("Please enter Address")
      .min(2, "Address must be at least 2 characters"),
    // .matches(/[0-9]+/, "Enter correct url!")

    latitude: Yup.number().required("Please enter Latitude"),
    longitude: Yup.number().required("Please enter Longitude"),
  });

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
                            <Field
                              name="address"
                              type="text"
                              className={`form-control`}
                              placeholder="Enter Address"
                              autoComplete="off"
                            />
                            {errors.address && touched.address ? (
                              <span className="errorMsg">{errors.address}</span>
                            ) : null}
                          </div>
                          <div className="form-group">
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
