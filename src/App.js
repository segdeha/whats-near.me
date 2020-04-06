import React from 'react';
import Map from './Map';
import Intro from './Intro';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        What’s near me?
      </header>
      <main className="App-map">
        <Map />
      </main>
      <footer className="App-info">
        <Intro />
      </footer>
    </div>
  );
}

export default App;
