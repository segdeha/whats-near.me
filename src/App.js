import React, { useState } from 'react';
import Map from './Map';
import Info from './Info';
import './App.css';

const App = () => {
  const [place, setPlace] = useState(null);
  const [places, setPlaces] = useState([]);
  const [geo, allowGeo] = useState(null);

  return (
    <div className="App">
      <header className="App-header">
        <a className="ahn" target="_blank" rel="noopener noreferrer" href="https://andrew.hedges.name">
          <img src="/triskelion.png" alt="Built by Andrew Hedges" />
        </a>
        <a className="github" target="_blank" rel="noopener noreferrer" href="https://github.com/segdeha/whats-near.me">
          <img src="/octocat.png" alt="See this project on GitHub" />
        </a>
        What’s near me?
      </header>
      <main className="App-map">
        <Map geo={ geo }
             places={ places }
             setPlace={ setPlace }
             setPlaces={ setPlaces }
        />
      </main>
      <footer className="App-info">
        <Info geo={ geo }
              place={ place }
              allowGeo={ allowGeo }
        />
      </footer>
    </div>
  );
}

export default App;
