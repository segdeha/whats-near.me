import React from 'react';

const Video = props => {
  const { platform } = props;
  return (
    <>
      <video className="App-info-how-to" poster={ `/img/screen-grab-${platform}.png` } controls preload="metadata">
        <source src={ `/img/screen-cast-${platform}.mp4` } type="video/mp4" />
      </video>
    </>
  );
};

export default Video;
