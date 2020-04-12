import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import getNearby from './lib/getNearby';

const Me = () => <i>•</i>;

const Pin = ({ title, description, lat, lng, thumb, setPlace }) => {
  const place = {
    title,
    description,
    thumb
  };
  return (
    <div className="Map-pin" onClick={ evt => { setPlace(place) } } lat={ lat } lng={ lng }>
      <img src={ thumb } alt={ title } />
    </div>
  );
};

const defaultCenter = { // the kennedy school
  lat: 45.564455,
  lng: -122.630576
};

const defaultZoom = 14;

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: defaultCenter,
      places: []
    };
  }

  componentDidUpdate() {
    const { geo } = this.props;

    const newNearbyPlaces = loc => {
      const { latitude, longitude } = loc.coords;
      const { map, maps } = this.state;
      if (map && maps) {
        map.panTo(new maps.LatLng(latitude, longitude));
        this.setState({
          center: {
            lat: latitude,
            lng: longitude
          }
        });
      }
      let places = getNearby(latitude, longitude);
      places.then(json => {
        this.setState({
          places: json.query.pages
        });
      });
    };
    geo && navigator.geolocation.watchPosition(newNearbyPlaces)
  };

  renderPins(places) {
    const { setPlace } = this.props;
    const pins = places.map(place => {
      const { pageid, coordinates, thumbnail } = place;
      if (coordinates.length > 0) {
        let { lat, lon } = coordinates[0];
        return <Pin key={ pageid } { ...place } thumb={ thumbnail.source } lat={ lat } lng={ lon } setPlace={ setPlace } />
      }
      else {
        return null;
      }
    });
    return pins;
  };

  render() {
    const { places, center } = this.state;
    return (
      <div className="Map-container">
        <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyDvSl4yqevaoY63RJwzf74Civuq4uCBWf0' }}
            defaultCenter={ defaultCenter }
            defaultZoom={ defaultZoom }
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => {
              this.setState({ map, maps });
            }}
          >
          { this.renderPins(places) }
          <Me lat={ center.lat } lng={ center.lng } />
        </GoogleMapReact>
      </div>
    );
  }
}

export default Map;
