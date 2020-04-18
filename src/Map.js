import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import getNearby from './lib/getNearby';
import isDev from './lib/isDev';

const Me = () => <span className="me" role="img" aria-label="My location">🔵</span>;

const Pin = ({ title, description, lat, lng, thumb, setPlace }) => {
  const place = {
    title,
    description,
    thumb
  };
  return (
    <div className="Map-pin"
         onClick={ evt => { setPlace(place) } }
         lat={ lat }
         lng={ lng }
    >
      <img src={ thumb } alt={ title } />
    </div>
  );
};

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: this.defaultCenter,
      lastFetch: 0, // only fetch places once per minute max
      timer: null,  // for setTimeout calls for new place fetches
      watcher: null // for geolocation.watchPosition ID
    };
    this.logError = this.logError.bind(this);
    this.newNearbyPlaces = this.newNearbyPlaces.bind(this);
    this.watch = this.watch.bind(this);
  }

  interval = isDev() ? 1000 * 10 : 1000 * 30; // refetch more often in development

  defaultCenter = { // the kennedy school
    lat: 45.564455,
    lng: -122.630576
  };

  defaultZoom = 14;

  logError(err) {
    // only log warnings in development
    if (isDev()) {
      console.warn('ERROR(' + err.code + '): ' + err.message)
    }
  }

  newNearbyPlaces(loc) {
    const { latitude, longitude } = loc.coords;
    const { map, maps } = this.state;
    const { setPlaces } = this.props;
    if (map && maps) {
      map.addListener('click', evt => { evt.stop() });
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
      this.unwatch();
      setPlaces(json.query.pages);
    });
  }

  watch() {
    const { lastFetch } = this.state;
    const interval = this.interval;
    const now = Date.now();
    if (lastFetch + interval < now) {
      this.setState({
        lastFetch: now,
        timer: setTimeout(this.watch, interval),
        watcher: navigator.geolocation.watchPosition(this.newNearbyPlaces, this.logError)
      });
    }
  }

  unwatch() {
    const { watcher } = this.state;
    navigator.geolocation.clearWatch(watcher);
  }

  componentDidUpdate() {
    const { geo } = this.props;
    if (geo) {
      this.watch();
    }
  };

  renderPins(places) {
    const { setPlace } = this.props;
    const pins = places.map(place => {
      const { pageid, coordinates, thumbnail } = place;
      let thumb;
      if (thumbnail && thumbnail.source) {
        thumb = thumbnail.source;
      }
      if (coordinates.length > 0) {
        let { lat, lon } = coordinates[0];
        return (
          <Pin key={ pageid }
               thumb={ thumb }
               lat={ lat }
               lng={ lon }
               setPlace={ setPlace }
               { ...place }
          />
        );
      }
      else {
        return null;
      }
    });
    return pins;
  };

  render() {
    const { center } = this.state;
    const { places } = this.props;
    return (
      <div className="Map-container">
        <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyDvSl4yqevaoY63RJwzf74Civuq4uCBWf0' }}
            defaultCenter={ this.defaultCenter }
            defaultZoom={ this.defaultZoom }
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
