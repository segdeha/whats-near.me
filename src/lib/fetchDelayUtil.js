const fetchDelayUtil = {
  get: () => {
    // get fetchDelay value from localStorage, if one has been saved
    let value = localStorage.getItem('FETCH_DELAY');

    // keep these values in sync with Settings
    if (null === value) {
      value = 0; // larger numbers make less frequent requests, setting this to 0 gives a better first-run experience
    }
    else {
      // values in localStorage are strings, so cast as a number
      value = +value;
      if (value < 0) {
        value = 0;
      }
      else if (value > 30) {
        value = 30;
      }
    }

    return value;
  },
  set: value => {
    localStorage.setItem('FETCH_DELAY', value);
  }
};

export default fetchDelayUtil;
