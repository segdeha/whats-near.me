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
      fetching: false, // set to true when a fetch is in progress
      localGeo: false,
      myCenter: this.defaultCenter,
      mapCenter: this.defaultCenter,
      timer: null,     // fetch timer
    };
    this.logError = this.logError.bind(this);
    this.makeFirstFetch = this.makeFirstFetch.bind(this);
    this.newCenter = this.newCenter.bind(this);
    this.newNearbyPlaces = this.newNearbyPlaces.bind(this);
    this.panToCenter = this.panToCenter.bind(this);
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
    const { userHasPanned } = this.props;

    // set user center
    this.setState({
      myCenter: {
        lat: latitude,
        lng: longitude
      }
    });

    // only set map center if the user has not manually panned
    if (!userHasPanned) {
      this.setState({
        mapCenter: {
          lat: latitude,
          lng: longitude
        }
      });
    }

    // panToCenter will decide whether to pan based on whether the user
    // has manually panned
    this.panToCenter();
  }

  makeFirstFetch() {
    const { map, maps, timer } = this.state;
    const { setIsFirstFetch, setUserHasPanned } = this.props;

    setIsFirstFetch(false);

    // prevent infowindows from opening
    map.addListener('click', evt => { evt.stop() });

    // if user manually pans the map, stop watching for new locations
    map.addListener('dragstart', evt => {
      clearTimeout(timer);
      setUserHasPanned(true);
    });

    // when user stops manually panning the map, get places for
    // the new center
    map.addListener('dragend', () => {
      const handleIdle = () => {
        maps.event.removeListener(idleEvent);
        const latLng = map.getCenter();
        this.setState({
          mapCenter: {
            lat: latLng.lat(),
            lng: latLng.lng()
          }
        });
        this.newNearbyPlaces();
      };

      const idleEvent = map.addListener('idle', handleIdle);
    });

    // get first set of places
    this.newNearbyPlaces(true);
  }

  // conditions under which we want to fetch new places:
  // 1. no setTimeout has been set
  // 2. not currently fetching
  // 3. either:
  //      user has panned
  //        ok to fetch right away
  //      user has not panned
  //        elapsed time since last fetch is greater than the fetch delay
  //        if not enough time has passed since the last fetch
  //            set a timeout to trigger a fetch once the remaining time has passed
  newNearbyPlaces(isFirstFetch) {
    const { fetching, mapCenter, timer } = this.state;
    const { fetchDelay, lastFetch, setLastFetch, setPlaces, userHasPanned } = this.props;

    const now = Date.now();

    const doFetch = () => {
      this.setState({
        fetching: true
      });
      clearTimeout(timer);

      setLastFetch(now);

      getNearby(mapCenter.lat, mapCenter.lng)
        .then(json => {
          setPlaces(json.query.pages);
          this.setState({
            fetching: false
          });
          this.watch();
        })
        .catch(this.logError);
    };

    // bail early if we have a timer set or are currently doing a fetch
    if (timer || fetching) {
      return;
    }

    if (isFirstFetch) {
      doFetch();
    }
    else if (userHasPanned) {
      doFetch();
    }
    else {
      // convert to seconds to because fetchDelay is saved in seconds
      const elapsed = (now - lastFetch) / 1000;

      // elapsed time since last fetch is greater than the fetch delay
      if (elapsed > fetchDelay) {
        doFetch();
      }
      // not enough time has elapsed, so set a timer to fetch later
      else {
        // set timer for how much time is left
        const remaining = fetchDelay - elapsed;

        this.setState({
          timer: setTimeout(() => {
            this.setState({
              timer: null
            });
            doFetch();
          }, remaining * 1000)
        });
      }
    }
  }

  panToCenter() {
    const { myCenter, map, maps } = this.state;
    const { userHasPanned } = this.props;

    if (map && maps && !userHasPanned) {
      let idleEvent;
      const handleIdle = () => {
        this.newNearbyPlaces();
        maps.event.removeListener(idleEvent);
      };
      idleEvent = map.addListener('idle', handleIdle);
      map.panTo(new maps.LatLng(myCenter.lat, myCenter.lng));
    }
  }

  watch() {
    const { localGeo } = this.state;
    if (localGeo) {
      navigator.geolocation.watchPosition(this.newCenter, this.logError)
    }
  }

  componentDidUpdate() {
    const { localGeo, map, maps, userHasPanned, watcher } = this.state;
    const { apiLoaded, geo, isFirstFetch, setUserHasPanned } = this.props;

    if (apiLoaded && map && maps && isFirstFetch) {
      this.makeFirstFetch();
    }

    // start watching for location changes when the user grants
    // location access for the first time
    if (geo && !watcher && !localGeo) {
      this.setState({
        localGeo: true
      });
      this.watch();
      setUserHasPanned(false);
    }

    // basically a no-op if a fetch is in progress or pending
    if (localGeo && !userHasPanned) {
      this.panToCenter();
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
    const { myCenter } = this.state;
    const { geo, setApiLoaded, places, userHasPanned } = this.props;
    const mapCenterClassnames = userHasPanned ?
            'map-center active'
          : 'map-center';

    const newProps = {
      bootstrapURLKeys: { key: 'AIzaSyDvSl4yqevaoY63RJwzf74Civuq4uCBWf0' },
      defaultCenter: this.defaultCenter,
      defaultZoom: this.defaultZoom,
      yesIWantToUseGoogleMapApiInternals: true,
      onGoogleApiLoaded: ({ map, maps }) => {
        this.setState({ map, maps });
        setApiLoaded(true);
      }
    };

    return (
      <div className="Map-container">
        <GoogleMapReact {...newProps}>
          { this.renderPins(places) }
          { geo && <Me lat={ myCenter.lat } lng={ myCenter.lng } /> }
        </GoogleMapReact>
        <MapCenter classNames={ mapCenterClassnames } />
      </div>
    );
  }
}

export default Map;
