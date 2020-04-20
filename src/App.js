import React, { useState } from 'react';
import { Link, Route } from 'react-router-dom';
import localforage from 'localforage';
import { FETCH_DELAY } from './constants';

import Info from './Info';
import Map from './Map';
import Settings from './Settings';

import './App.css';

const App = () => {
  const [apiLoaded, setApiLoaded] = useState(false);
  const [fetchDelay, setFetchDelay] = useState(15); // in seconds
  const [geo, allowGeo] = useState(null);
  const [isFirstFetch, setIsFirstFetch] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [place, setPlace] = useState(null);
  const [places, setPlaces] = useState([]);
  const [userHasPanned, setUserHasPanned] = useState(true);

  // get fetchDelay value from localStorage, if one has been saved
  localforage
    .getItem(FETCH_DELAY)
    .then(value => {
      if (value && typeof value === 'number') {
        setFetchDelay(value);
      }
    })
  ;

  const videoIsPlaying = isVideoPlaying ? 'expanded' : '';

  const handleApiLoaded = () => {
    setApiLoaded(true);
  };

  const handleTitleClick = evt => {
    setPlace(null);
  };

  const handleCenterClick = evt => {
    evt.preventDefault();
    if (geo) {
      setUserHasPanned(false);
    }
  };

  const centerOnMeClasses = geo && userHasPanned ?
      'center-on-me active'
    : 'center-on-me';

  return (
    <div className={ `App ${videoIsPlaying}` }>
      <header className="App-header">
        <Link className={ centerOnMeClasses } to="/" onClick={ handleCenterClick }>
          <img src="/img/center-on-me.png" alt="Center on me" />
        </Link>
        <Link className="app-name" to="/" onClick={ handleTitleClick }>
          What’s near me?
        </Link>
        <Link className="settings" to="/settings">
          <img src="/img/settings.png" alt="Open settings panel" />
        </Link>
      </header>
      <main className="App-map">
        <Map apiLoaded={ apiLoaded }
             fetchDelay={ fetchDelay }
             geo={ geo }
             isFirstFetch={ isFirstFetch }
             handleApiLoaded={ handleApiLoaded }
             places={ places }
             setIsFirstFetch={ setIsFirstFetch }
             setPlace={ setPlace }
             setPlaces={ setPlaces }
             setUserHasPanned={ setUserHasPanned }
             userHasPanned={ userHasPanned }
        />
      </main>
      <footer className="App-info">
        <Info geo={ geo }
              place={ place }
              allowGeo={ allowGeo }
              setIsVideoPlaying={ setIsVideoPlaying }
        />
      </footer>
      <Route path="/settings">
        <Settings fetchDelay={ fetchDelay }
                  setFetchDelay={ setFetchDelay }
        />
      </Route>
    </div>
  );
}

export default App;
