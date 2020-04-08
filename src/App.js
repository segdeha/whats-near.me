import React, { useState } from 'react';
import Map from './Map';
import Intro from './Intro';
import './App.css';

const App = () => {
  const [place, setPlace] = useState(null);
  const [geo, allowGeo] = useState(null);

  return (
    <div className="App">
      <header className="App-header">
        What’s near me?
      </header>
      <main className="App-map">
        <Map geo={ geo } setPlace={ setPlace } />
      </main>
      <footer className="App-info">
        <Intro geo={ geo } allowGeo={ allowGeo } place={ place } />
      </footer>
    </div>
  );
}

export default App;
