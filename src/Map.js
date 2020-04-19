import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

import getNearby from './lib/getNearby';
import isDev from './lib/isDev';

import Me from './Me';
import Pin from './Pin';

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myCenter: this.defaultCenter,
      mapCenter: this.defaultCenter,
      fetching: false // set to true when a fetch is in progress
    };
    this.logError = this.logError.bind(this);
    this.newCenter = this.newCenter.bind(this);
    this.newNearbyPlaces = this.newNearbyPlaces.bind(this);
    this.panToCenter = this.panToCenter.bind(this);
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

  // coming from navigator.geolocation.watchPosition
  newCenter(loc) {
    const { latitude, longitude } = loc.coords;
    const { map, maps } = this.state;
    const { isFirstFetch, setIsFirstFetch, setUserHasPanned, userHasPanned } = this.props;
    this.setState({
      myCenter: {
        lat: latitude,
        lng: longitude
      }
    });
    if (!userHasPanned) {
      this.setState({
        mapCenter: {
          lat: latitude,
          lng: longitude
        }
      });
    }
    if (map && maps) {
      if (isFirstFetch) {
        map.addListener('click', evt => { evt.stop() });
        map.addListener('dragstart', evt => { setUserHasPanned(true) });
        map.addListener('dragend', () => {
          const latLng = map.getCenter();
          const lat = latLng.lat();
          const lng = latLng.lng();
          this.setState({
            mapCenter: {
              lat,
              lng
            }
          });
          this.newNearbyPlaces();
        });
        setIsFirstFetch(false);
      }
      else {
        if (!userHasPanned) {
          this.newNearbyPlaces();
        }
        this.panToCenter();
      }
    }
  }

  newNearbyPlaces() {
    const { mapCenter } = this.state;
    const { geo, setPlaces } = this.props;
    if (geo) {
      let places = getNearby(mapCenter.lat, mapCenter.lng);
      places.then(json => {
        setPlaces(json.query.pages);
      });
    }
  }

  panToCenter() {
    const { myCenter, map, maps } = this.state;
    const { userHasPanned } = this.props;
    if (map && maps && !userHasPanned) {
      map.panTo(new maps.LatLng(myCenter.lat, myCenter.lng));
      this.newNearbyPlaces();
    }
  }

  // watch() {
  //   const { lastFetch } = this.state;
  //   const interval = this.interval;
  //   const now = Date.now();
  //   if (lastFetch + interval < now) {
  //     this.setState({
  //       lastFetch: now,
  //       timer: setTimeout(this.watch, interval)
  //     });
  //   }
  // }

  componentDidUpdate() {
    const { geo } = this.props;
    if (geo) {
      navigator.geolocation.watchPosition(this.newCenter, this.logError);
    }
    this.panToCenter();
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
    const { myCenter } = this.state;
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
          <Me lat={ myCenter.lat } lng={ myCenter.lng } />
        </GoogleMapReact>
      </div>
    );
  }
}

export default Map;
