import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

import getNearby from './lib/getNearby';
import isDev from './lib/isDev';

import MapCenter from './MapCenter';
import Me from './Me';
import Pin from './Pin';

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myCenter: this.defaultCenter,
      mapCenter: this.defaultCenter,
      fetching: false, // set to true when a fetch is in progress
      watcher: null // for navigator.geolocation.watchPosition
    };
    this.logError = this.logError.bind(this);
    this.makeFirstFetch = this.makeFirstFetch.bind(this);
    this.newCenter = this.newCenter.bind(this);
    this.newNearbyPlaces = this.newNearbyPlaces.bind(this);
    this.panToCenter = this.panToCenter.bind(this);
    this.unwatch = this.unwatch.bind(this);
    this.watch = this.watch.bind(this);
  }

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
    const { isFirstFetch, userHasPanned } = this.props;
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
        this.makeFirstFetch();
      }
      else {
        if (!userHasPanned) {
          this.newNearbyPlaces();
        }
        this.panToCenter();
      }
    }
  }

  makeFirstFetch() {
    const { map } = this.state;
    const { setIsFirstFetch, setUserHasPanned } = this.props;
    map.addListener('click', evt => { evt.stop() });
    map.addListener('dragstart', evt => {
      this.unwatch();
      setUserHasPanned(true);
    });
    map.addListener('dragend', () => {
      const latLng = map.getCenter();
      this.setState({
        mapCenter: {
          lat: latLng.lat(),
          lng: latLng.lng()
        }
      });
      this.newNearbyPlaces();
    });
    this.newNearbyPlaces();
    setIsFirstFetch(false);
  }

  newNearbyPlaces() {
    const { mapCenter } = this.state;
    const { setPlaces } = this.props;
    let places = getNearby(mapCenter.lat, mapCenter.lng);
    places.then(json => {
      setPlaces(json.query.pages);
    });
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

  watch() {
    this.setState({
      watcher: navigator.geolocation.watchPosition(this.newCenter, this.logError)
    });
  }

  unwatch() {
    let { watcher } = this.state;
    navigator.geolocation.clearWatch(watcher);
    this.setState({
      watcher: null
    });
  }

  componentDidUpdate() {
    const { map, maps, watcher } = this.state;
    const { apiLoaded, geo, isFirstFetch, setUserHasPanned } = this.props;

    if (apiLoaded && map && maps && isFirstFetch) {
      this.makeFirstFetch();
    }
    if (geo && !watcher) {
      this.watch();
      setUserHasPanned(false);
    }
    // this is here in case the user manually pans then hits the bullseye
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
    const { geo, handleApiLoaded, places, userHasPanned } = this.props;
    const mapCenterClassnames = userHasPanned ?
            'map-center active'
          : 'map-center';
    return (
      <div className="Map-container">
        <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyDvSl4yqevaoY63RJwzf74Civuq4uCBWf0' }}
            defaultCenter={ this.defaultCenter }
            defaultZoom={ this.defaultZoom }
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => {
              this.setState({ map, maps });
              handleApiLoaded();
            }}
          >
          { this.renderPins(places) }
          { geo && <Me lat={ myCenter.lat } lng={ myCenter.lng } /> }
        </GoogleMapReact>
        <MapCenter classNames={ mapCenterClassnames } />
      </div>
    );
  }
}

export default Map;
