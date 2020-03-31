import React from 'react';
import GoogleMapReact from 'google-map-react';
import './App.css';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

function App() {
  return (
    <div className="App">
      <header className="App-header">
        What’s near me?
      </header>
      <main></main>
    </div>
  );
}

export default App;
