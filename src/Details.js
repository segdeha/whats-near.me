import React, { useRef } from 'react';
import Video from './Video.js';

const Details = props => {
  let timer = undefined;
  const detailsRef = useRef(null);
  const { platform, setIsVideoPlaying } = props;
  const handleClick = evt => {
    const el = detailsRef.current;
    const vid = el.querySelector('video');
    // let the page redraw before asking whether the details
    // element is open or closed
    window.requestAnimationFrame(() => {
      if (el.open) {
        setIsVideoPlaying(true);
        timer = setTimeout(() => {
          vid.play();
        }, 2000);
      }
      else {
        clearTimeout(timer);
        vid.pause();
        setIsVideoPlaying(false);
      }
    });
  };
  const summary = 'ios' === platform ?
        'How to: iOS'
      : 'How to: Android';
  const text = 'ios' === platform ?
        'In Safari, tap the share icon at the bottom middle of the window.'
      : 'In Chrome, tap the three dots at the top right of the window.';
  return (
    <details ref={ detailsRef } onClick={ handleClick }>
      <summary>{ summary }</summary>
      <p>{ text }</p>
      <Video platform={ platform } />
    </details>
  );
};

export default Details;
