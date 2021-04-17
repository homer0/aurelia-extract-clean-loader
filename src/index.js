/**
 * This is the library with a set of utilities Webpack recommends when you are writing a
 * custom loader.
 *
 * @type {Object}
 * @property {Function} getOptions  Get the options that may have been sent to the loader
 *                                  on the implementation configuration.
 */
const loaderUtils = require('loader-utils');
/**
 * The _"core"_ of this loader. It is the class that actually parses and cleans the code.
 *
 * @type {AureliaExtractCleaner}
 */
const AureliaExtractCleaner = require('./lib/aureliaExtractCleaner');

/**
 * The loader Webpack uses to process the HTML files that need `require` tags to be
 * removed.
 *
 * @param {string} source  The HTML contents to process.
 * @returns {string} The HTML contents processed and with the extracted `require` tags
 *                   removed.
 */
const aureliaExtractCleanLoader = (source) =>
  new AureliaExtractCleaner(source, loaderUtils.getOptions(this)).process();

module.exports = aureliaExtractCleanLoader;
