import React from 'react';
import { firstCap } from './lib/text';

const Info = props => {
  const { place, geo, allowGeo } = props;
  if (place) {
    const { title, description, thumb } = place;
    const wikiLink = `https://www.wikipedia.org/search-redirect.php?search=${title}&family=wikipedia&hiddenLanguageInput=en`;
    return (
      <div className="App-info-container">
        <p><strong>{ firstCap(title) }</strong></p>
        <img src={ thumb } alt={ firstCap(title) } />
        <p>{ firstCap(description) }</p>
        <p><a target="_blank" rel="noopener noreferrer" href={ wikiLink }>See more about this spot on Wikipedia</a></p>
      </div>
    );
  }
  else {
    return (
      <div className="App-info-container">
        <h1>Welcome!</h1>
        {
          geo ? <p><button disabled>Location shared!</button></p>
              : <p><button onClick={ () => allowGeo(true) }>Share Location</button></p>
        }
        <p><strong>Click “Share Location”</strong> to discover interesting landmarks around you from Wikipedia.</p>
        <p><strong>Tap on a marker</strong> on the map and more information about it will show up in this space. Have fun!</p>
        <p><em>Note: Your location data is never stored in the app or on our servers!</em></p>
      </div>
    );
  }
};

export default Info;
