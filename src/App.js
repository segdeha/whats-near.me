import React from 'react';
import Map from './Map.js';
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
    </div>
  );
}

export default App;
