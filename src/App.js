import React, { useState } from 'react';
import { Link, Route } from 'react-router-dom';

import Info from './Info';
import Map from './Map';
import Settings from './Settings';

import './App.css';

const App = () => {
  const [geo, allowGeo] = useState(null);
  const [isFirstFetch, setIsFirstFetch] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [place, setPlace] = useState(null);
  const [places, setPlaces] = useState([]);
  const [userHasPanned, setUserHasPanned] = useState(false);

  const videoIsPlaying = isVideoPlaying ? 'expanded' : '';

  const handleTitleClick = evt => {
    setPlace(null);
  };

  const handleCenterClick = evt => {
    evt.preventDefault();
    setUserHasPanned(false);
  };

  const centerOnMeClasses = userHasPanned ?
      'center-on-me active'
    : 'center-on-me';

  return (
    <div className={ `App ${videoIsPlaying}` }>
      <header className="App-header">
        <Link className={ centerOnMeClasses } to="/" onClick={ handleCenterClick }>
          <span role="img" aria-label="Center on me">🎯</span>
        </Link>
        <Link className="app-name" to="/" onClick={ handleTitleClick }>
          What’s near me?
        </Link>
        <Link className="settings" to="/settings">
          <span role="img" aria-label="Open settings panel">⚙︎</span>
        </Link>
      </header>
      <main className="App-map">
        <Map geo={ geo }
             isFirstFetch={ isFirstFetch }
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
        <Settings />
      </Route>
    </div>
  );
}

export default App;
