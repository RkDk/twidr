function getUnixTime(timestamp) {
  if (!timestamp) {
    return +Date.now();
  }
  const input = isNaN(timestamp) ? `${timestamp}+0000` : +timestamp;
  return +new Date(input);
}

module.exports = {
  getUnixTime
};
