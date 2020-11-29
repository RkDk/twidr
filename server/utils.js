function getUnixTime(timestamp) {
  if (!timestamp) {
    return +Date.now();
  }
  const input = isNaN(timestamp) ? timestamp : +timestamp;
  return +new Date(input);
}

module.exports = {
  getUnixTime
};
