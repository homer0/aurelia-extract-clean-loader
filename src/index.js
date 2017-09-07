/**
 * This is the library with a set of utilities Webpack recommends when you are writing a custom
 * loader.
 * @type {Object}
 * @property {Function} getOptions Get the options that may have been sent to the loader on the
 *                                 implementation configuration.
 */
const loaderUtils = require('loader-utils');
/**
 * The _"core"_ of this loader. It is the class that actually parses and cleans the code.
 * @type {AureliaExtractCleaner}
 */
const AureliaExtractCleaner = require('./lib/aureliaExtractCleaner');
/**
 * The loader Webpack uses to process the HTML files that need `require` tags to be removed.
 * @param {String} source The HTML contents to process.
 * @return {String} The HTML contents processed and with the extracted `require` tags removed.
 */
module.exports = function aureliaExtractCleanLoader(source) {
  return new AureliaExtractCleaner(source, loaderUtils.getOptions(this)).process();
};
