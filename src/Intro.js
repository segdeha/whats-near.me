import React, {Component} from 'react';

const style = {
  padding: '1px 1rem'
};

const Intro = () => {
  return (
    <div style={ style }>
      <h1>Welcome!</h1>
      <p>Once you’ve given What’s Near Me? access to your location, when the app is open you can discover interesting landmarks around you.</p>
      <p>Tap on a marker on the map and more information about it will show up in this space. Have fun!</p>
      <p><strong>Note:</strong> Your location data is never stored in the app or on our servers!</p>
    </div>
  );
};

export default Intro;
