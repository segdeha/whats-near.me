const fetchDelayUtil = {
  get: () => {
    // get fetchDelay value from localStorage, if one has been saved
    let value = localStorage.getItem('FETCH_DELAY');

    if (null === value) {
      value = 15;
    }
    else {
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
