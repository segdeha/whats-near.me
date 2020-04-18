import React from 'react';

const LinkToBlank = props => {
  const { href, text } = props;
  return (
    <a href={ href } target="_blank" rel="noopener noreferrer">
      { text }
    </a>
  );
};

export default LinkToBlank;
