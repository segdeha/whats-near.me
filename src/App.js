import React, { useState } from 'react';
import Map from './Map';
import Intro from './Intro';
import './App.css';

const App = () => {
  const [place, setPlace] = useState(null);
  return (
    <div className="App">
      <header className="App-header">
        What’s near me?
      </header>
      <main className="App-map">
        <Map setPlace={ setPlace } />
      </main>
      <footer className="App-info">
        <Intro place={ place } />
      </footer>
    </div>
  );
}

export default App;
