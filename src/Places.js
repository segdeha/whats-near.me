import React, { Component } from 'react';

const Pin = ({ title }) => <div className="Map-pin">{ title }</div>;

const Places = ({ places }) => {
  let pins = places.map(place => {
    const { pageid, title } = place;
    return <Pin key={ pageid } title={ title } />
  });
  return (
    <>
      { pins }
    </>
  );
};

export default Places;
