import React from 'react';

const style = {
  padding: '1px 1rem'
};

const Intro = props => {
  const { place } = props;
  if (place) {
    const { title, thumb } = place;
    return (
      <div style={ style }>
        <p>{ title }</p>
        <img src={ thumb } alt={ title } />
      </div>
    );
  }
  else {
    return (
      <div style={ style }>
        <h1>Welcome!</h1>
        <p>Once you’ve given the app access to your location, when it’s open you can discover interesting landmarks around you.</p>
        <p>Tap on a marker on the map and more information about it will show up in this space. Have fun!</p>
        <p><strong>Note:</strong> Your location data is never stored in the app or on our servers!</p>
      </div>
    );
  }
};

export default Intro;
