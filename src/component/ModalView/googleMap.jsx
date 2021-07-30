import React, { useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "400px",
  height: "400px",
};

const MyMapComponent = (props) => {
  //   console.log("latitude ", props.detailsLocation.latitude);
  //   console.log("longitude ", props.detailsLocation.longitude);

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    // const bounds = new window.google.maps.LatLngBounds();
    // map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{
        lat:
          props.detailsLocation && props.detailsLocation.latitude > 0.0
            ? parseFloat(props.detailsLocation.latitude)
            : 22.254897,
        lng:
          props.detailsLocation && props.detailsLocation.longitude > 0.0
            ? parseFloat(props.detailsLocation.longitude)
            : 88.254897,
      }}
      zoom={8}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {props.detailsLocation && props.detailsLocation.latitude > 0.0 && (
        <Marker
          position={{
            lat: parseFloat(props.detailsLocation.latitude),
            lng: parseFloat(props.detailsLocation.longitude),
          }}
        />
      )}
    </GoogleMap>
  );
};

export default MyMapComponent;
