const loaderUtils = require('loader-utils');
const AureliaExtractCleaner = require('./lib/aureliaExtractCleaner');

module.exports = function aureliaExtractCleanLoader(source) {
  return new AureliaExtractCleaner(source, loaderUtils.getOptions(this)).process();
};
