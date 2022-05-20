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
const aureliaExtractCleanLoader = function aureliaExtractCleanLoader(source) {
  return new AureliaExtractCleaner(source, this.getOptions()).process();
};

module.exports = aureliaExtractCleanLoader;
