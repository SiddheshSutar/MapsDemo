import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import { Icon } from '@iconify/react'
import locationIcon from '@iconify/icons-mdi/map-marker'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Col, Container, Form, Row, Tab, Tabs } from 'react-bootstrap';
import Map from './Map';
import { GoogleApiWrapper } from 'google-maps-react';
import InitMap from './initMap';
import { nearbySearch } from './services';
import { nearbyoutput } from './JSON/nearbyOutput';
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { initAutoCompleteFunction } from './functons';

const App = () => {

  const [state, setState] = useState({
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 17,
  })

  const [locationString, setLocationString] = useState('')

  useEffect(() => {

    
    // position()

        console.log('hex: ', window.mapObj)



  }, [])


  // const AnyReactComponent = ({ text }) => <div>{text}</div>;
  const AnyReactComponent = ({ text }) => <div>
    <Icon icon={locationIcon} className="pin-icon" />
    <p className="pin-text">{text}</p>
  </div>;

  const position = async () => {
    await navigator.geolocation.getCurrentPosition(
      position => setState({
        ...state,
        center: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      }),
      err => console.log('err: ', err)
    );
  }

  const handleChangeLocation = e => {
    e.preventDefault()
    setLocationString(e.target.value)

  }

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      console.log('ENTER')
      // nearbySearch({
      //   lat: -33.8670522,
      //   lng: 151.1957362,
      //   radius: 1500,
      //   searchType: 'restaurant',
      //   keywordType: 'cruise'
      // })

  const inputhere = document.getElementById("search-input");

      const searchBox = new window.google.maps.places.SearchBox(inputhere);


      const maphere = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: -40, lng: 150 },
        zoom: 15,
        mapTypeId: "roadmap",
      });

      console.log('hex : searchBox : ', maphere)

      initAutoCompleteFunction({
        mapPassed: maphere,
        inputPassed: inputhere
      })


    }
    
  }

  const handlePlaceRadioChange = e => {
    console.log('/handlePlaceRadioChange')
  }

  const renderr = (status) => {
    return <h1>{status}</h1>;
  };


  // const Marker = (options) => {
    // const [marker, setMarker] = React.useState();
  
  //   React.useEffect(() => {
  //     if (!marker) {
  //       setMarker(new google.maps.Marker());
  //     }
  
  //     // remove marker from map on unmount
  //     return () => {
  //       if (marker) {
  //         marker.setMap(null);
  //       }
  //     };
  //   }, [marker]);
  //   React.useEffect(() => {
  //     if (marker) {
  //       marker.setOptions(options);
  //     }
  //   }, [marker, options]);
  //   return null;
  // };

  // const Map = ({
  //   onClick,
  //   onIdle,
  //   children,
  //   style,
  //   ...options
  // }) => {
  //   return (
  //     <>
  //       <div ref={ref} style={style} />
  //       {React.Children.map(children, (child) => {
  //         if (React.isValidElement(child)) {
  //           // set the map prop on the child component
  //           return React.cloneElement(child, { map });
  //         }
  //       })}
  //     </>
  //   );
  // }

  return (
    <div className="App">
      {/*  */}
      <Tabs defaultActiveKey="home" id="uncontrolled-tab-example" className="mb-3">
        <Tab eventKey="home" title="Home">
          {/* <Map /> */}
          {/* <InitMap /> */}
          <Container>
            <Form.Group as={Col} md="4" controlId="validationCustom01">
              <Form.Label>Search Location</Form.Label>
              <Form.Control
                required
                type="text"
                id="search-input"
                placeholder="Location"
                defaultValue=""
                value={locationString}
                onChange={e => handleChangeLocation(e)}
                onKeyDown={e => handleKeyDown(e)}
              />
            </Form.Group>
            <div style={{ height: '300px', width: '100%' }}>
              {state && <GoogleMapReact
                bootstrapURLKeys={{ key: 'AIzaSyC68H9SdF9KiJWStgwPugHIgY_IILwefRo' }}
                defaultCenter={state.center}
                defaultZoom={state.zoom}
              >
                <AnyReactComponent
                  lat={state.lat}
                  lng={state.long}
                  text="My Marker"
                />

              </GoogleMapReact>}
              <div id="container">
                <div id="map"></div>
                <div id="HDFC"></div>
                <input id="pac-input" class="controls" type="text" placeholder="Search Box" />
                <div id="sidebar">
                  <h2>Results</h2>
                  <ul id="places"></ul>
                  <button id="more">Load more results</button>
                </div>
              </div>


              {/* <Wrapper apiKey={"AIzaSyC68H9SdF9KiJWStgwPugHIgY_IILwefRo"} render={renderr}>
              <Map center={center} zoom={zoom}>
                <Marker position={position} />
              </Map>
              </Wrapper> */}
            </div>
            

            {
              nearbyoutput.results.map(element => (
                <Row className="radio-row">
                  <Col>
                    <Row>{element.name}</Row>
                    <Row>{element.vicinity}</Row>
                  </Col>
                  <Col>
                    <Form>
                      <Form.Check
                        type="switch"
                        id="custom-switch"
                        label="Check this switch"
                        onChange={e => handlePlaceRadioChange(e)}
                      />
                    </Form>
                  </Col>
                </Row>
              ))
            }
          </Container>

        </Tab>
        <Tab eventKey="about" title="About">
          About
        </Tab>
      </Tabs>
    </div>
  );
}

export default App;