import React from 'react';
import { Link } from 'react-router-dom';
import LinkToBlank from './LinkToBlank';

const Settings = props => {
  return (
    <section className="modal">
      <article className="content">
        <h2>Settings</h2>
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
