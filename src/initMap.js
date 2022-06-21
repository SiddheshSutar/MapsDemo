import {GoogleApiWrapper, InfoWindow, Map, Marker} from 'google-maps-react';
import React, { Component } from 'react';


// class MapContainer extends Component {
    const MapContainer = ({
        google,

    }) => {
    // render() {
      return (
        <Map google={this.props.google} zoom={14}>
   
          <Marker onClick={this.onMarkerClick}
                  name={'Current location'} />
   
          <InfoWindow onClose={this.onInfoWindowClose}>
              <div>
                <h1>{this.state.selectedPlace.name}</h1>
              </div>
          </InfoWindow>
        </Map>
      );
    // }
  }


export default GoogleApiWrapper({
    apiKey: 'AIzaSyC68H9SdF9KiJWStgwPugHIgY_IILwefRo'
  })(MapContainer)