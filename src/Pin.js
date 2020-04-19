import React from 'react';

const Pin = ({ title, description, lat, lng, thumb, setPlace }) => {
  const place = {
    title,
    description,
    thumb
  };
  return (
    <div className="Map-pin"
         onClick={ evt => { setPlace(place) } }
         lat={ lat }
         lng={ lng }
    >
      <img src={ thumb } alt={ title } />
    </div>
  );
};

export default Pin;
