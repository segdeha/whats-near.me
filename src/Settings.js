import React from 'react';
import { Link } from 'react-router-dom';
import ReactSlider from 'react-slider';
import LinkToBlank from './LinkToBlank';

const Settings = props => {
  const { fetchDelay, setFetchDelay } = props;
  const [min, max, step] = [0, 30, 5];
  return (
    <section className="modal">
      <article className="content">
        <h2>Settings</h2>
        <p>Set how frequently the app will fetch new places. Values are in seconds.</p>
        <div className="slider-legend">
          <span className="slider-car" />
          <span className="slider-bike" />
          <span className="slider-walker" />
        </div>
        <ReactSlider
          className="slider-horizontal"
          thumbClassName="slider-thumb"
          trackClassName="slider-track"
          defaultValue={ fetchDelay }
          min={ min }
          max={ max }
          step={ step }
          onChange={ setFetchDelay }
          renderThumb={(props, state) => <div {...props}>{ fetchDelay }</div>}
        />
        <h2>About</h2>
        <p><strong>What’s near me?</strong> is the work of <LinkToBlank href="https://andrew.hedges.name" text="Andrew Hedges" />.</p>
        <p>The project code is publicly available <LinkToBlank href="https://github.com/segdeha/whats-near.me" text="on GitHub" />.</p>
      </article>
      <Link className="close-x" to="/">
        <img src="/img/close-x.png" alt="Close modal" />
      </Link>
    </section>
  );
};

export default Settings;
