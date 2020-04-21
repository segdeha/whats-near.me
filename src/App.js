import React, { useState } from 'react';
import { Link, Route } from 'react-router-dom';
import fetchDelayUtil from './lib/fetchDelayUtil';

import Info from './Info';
import Map from './Map';
import Settings from './Settings';

import './App.css';

const App = () => {
  const delay = fetchDelayUtil.get();

  const [apiLoaded, setApiLoaded] = useState(false);
  const [fetchDelay, setFetchDelay] = useState(delay); // in seconds
  const [geo, allowGeo] = useState(null);
  const [isFirstFetch, setIsFirstFetch] = useState(true);
  const [lastFetch, setLastFetch] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [place, setPlace] = useState(null);
  const [places, setPlaces] = useState([]);
  const [userHasPanned, setUserHasPanned] = useState(true);

  const handleTitleClick = evt => {
    setPlace(null);
  };

  const handleCenterClick = evt => {
    evt.preventDefault();
    setUserHasPanned(false);
    setLastFetch(0);
  };

  const videoIsPlaying = isVideoPlaying ? 'expanded' : '';

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
             lastFetch={ lastFetch }
             setApiLoaded={ setApiLoaded }
             places={ places }
             setIsFirstFetch={ setIsFirstFetch }
             setLastFetch={ setLastFetch }
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
