import React from 'react';
import { firstCap } from './lib/text';

const Intro = props => {
  const { place, geo, allowGeo } = props;
  if (place) {
    const { title, description, thumb } = place;
    return (
      <div className="App-info-container">
        <p><strong>{ firstCap(title) }</strong></p>
        <img src={ thumb } alt={ firstCap(title) } />
        <p>{ firstCap(description) }</p>
      </div>
    );
  }
  else {
    return (
      <div className="App-info-container">
        <h1>Welcome!</h1>
        {
          geo ? <p><strong>Location shared!</strong></p>
              : <p><button onClick={ () => allowGeo(true) }>Share Location</button></p>
        }
        <p>Once you’ve given the app access to your location, when it’s open you can discover interesting landmarks around you.</p>
        <p>Tap on a marker on the map and more information about it will show up in this space. Have fun!</p>
        <p><strong>Note:</strong> Your location data is never stored in the app or on our servers!</p>
      </div>
    );
  }
};

export default Intro;
