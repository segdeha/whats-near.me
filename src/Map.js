import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import getNearby from './lib/getNearby';

const Me = () => <i>•</i>;

const Pin = ({ title, lat, lng }) => <div className="Map-pin" lat={ lat } lng={ lng }>{ title }</div>;

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: { // the kennedy school
        lat: 45.564455,
        lng: -122.630576
      },
      zoom: 14,
      places: []
    };
  }

  componentDidMount() {
    let newNearbyPlaces = loc => {
      const { latitude, longitude } = loc.coords;
      const { map, maps } = this.state;
      if (map && maps) {
        map.panTo(new maps.LatLng(latitude, longitude));
      }
      let places = getNearby(latitude, longitude);
      places.then(json => {
        this.setState({
          places: json.query.pages
        });
      });
    };
    let geo = navigator.geolocation.watchPosition(newNearbyPlaces)
  }

  render() {
    let { places, center, zoom } = this.state;
    return (
      <div style={{ height: '100vh', width: '100vw' }}>
        <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyDvSl4yqevaoY63RJwzf74Civuq4uCBWf0' }}
            defaultCenter={ center }
            defaultZoom={ zoom }
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => {
              this.setState({ map, maps });
            }}
          >
          <Me center={ center } />
          {places.map(place => {
            const { pageid, title, coordinates } = place;
            if (coordinates.length > 0) {
              let { lat, lon } = coordinates[0];
              return <Pin key={ pageid } title={ title } lat={ lat } lng={ lon } />
            }
            else {
              return null;
            }
          })}
        </GoogleMapReact>
      </div>
    );
  }
}

export default Map;
