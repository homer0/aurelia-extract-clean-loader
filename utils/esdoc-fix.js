module.exports = {
  onHandleCode(ev) {
    // eslint-disable-next-line no-param-reassign
    ev.data.code = ev.data.code
    .replace(/module\.exports = /g, 'export default ')
    .replace(/exports = /g, 'export default ')
    .replace(/const (\w+) = require\((.*?)\)/, 'import $1 from $2');
  },
};
