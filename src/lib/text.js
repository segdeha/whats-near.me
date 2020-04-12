const firstCap = (str) => {
  if (str && str.length > 0) {
    let firstLetter = str.charAt(0).toUpperCase();
    let remainder = str.slice(1);
    str = `${firstLetter}${remainder}`;
  }
  return str;
};

export { firstCap };
