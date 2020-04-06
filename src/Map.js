import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import getNearby from './lib/getNearby';
import Places from './Places';
import Me from './Me';

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      places: []
    };
  }

  static defaultProps = {
    center: { // the kennedy school
      lat: 45.564455,
      lng: -122.630576
    },
    zoom: 15
  };

  componentDidMount() {
    let newNearbyPlaces = loc => {
      const { latitude, longitude } = loc.coords;
      let places = getNearby(latitude, longitude);
      places.then(json => {

// console.log('json.query.pages[0]', json.query.pages[0])

          this.setState({
            places: json.query.pages
          });
        });
      };

      let geo = navigator.geolocation.watchPosition(newNearbyPlaces)
  }

  render() {
    let { places } = this.state;
    let { center, zoom } = this.props;
    return (
      <div style={{ height: '100vh', width: '100vw' }}>
        <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyDvSl4yqevaoY63RJwzf74Civuq4uCBWf0' }}
            defaultCenter={ center }
            defaultZoom={ zoom }
          >
          <Me center={ center } />
          <Places places={ places } />
        </GoogleMapReact>
      </div>
    );
  }
}

export default Map;