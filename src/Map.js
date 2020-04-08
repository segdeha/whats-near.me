import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import getNearby from './lib/getNearby';

const Me = () => <i>•</i>;

const Pin = ({ title, lat, lng, thumb, setPlace }) => {
  const style = {
    height: '100%',
    objectFit: 'cover',
    width: '100%'
  };
  const place = {
    title,
    thumb
  };
  return (
    <div onClick={ () => { setPlace(place) } } className="Map-pin" lat={ lat } lng={ lng }>
      <img style={ style } src={thumb} alt={title} />
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

    let newNearbyPlaces = loc => {
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

// console.log('json.query.pages', json.query.pages)

        this.setState({
          places: json.query.pages
        });
      });
    };
    geo && navigator.geolocation.watchPosition(newNearbyPlaces)
  }

  render() {
    let { places, center } = this.state;
    let { setPlace } = this.props;
    return (
      <div style={{ height: '100%', width: '100%' }}>
        <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyDvSl4yqevaoY63RJwzf74Civuq4uCBWf0' }}
            defaultCenter={ defaultCenter }
            defaultZoom={ defaultZoom }
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => {
              this.setState({ map, maps });
            }}
          >
          {places.map(place => {
            const { pageid, title, coordinates, thumbnail } = place;
            if (coordinates.length > 0) {
              let { lat, lon } = coordinates[0];
              return <Pin key={ pageid } title={ title } thumb={ thumbnail.source } lat={ lat } lng={ lon } setPlace={ setPlace } />
            }
            else {
              return null;
            }
          })}
          <Me lat={ center.lat } lng={ center.lng } />
        </GoogleMapReact>
      </div>
    );
  }
}

export default Map;
