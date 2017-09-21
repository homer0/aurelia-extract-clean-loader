/**
 * This is the _core_ of the `aurelia-extract-clean-loader`: The loader itself calls this class
 * in order too look for `require` tags that are being extracted by `extract-text-webpack-plugin`
 * and remove them so Aurelia won't try to reprocess them on runtime.
 *
 * @class
 * @example
 * const html = 'Bat<require from="file.scss" extract="true"></require>man';
 * const cleaner = new AureliaExtractCleaner(html);
 * console.log(cleaner.process());
 * // It would output 'Batman'
 */
class AureliaExtractCleaner {
  /**
   * Class constructor.
   * @param {String} source       The HTML code where the `require` tags are going to be removed
   *                              from.
   * @param {Object} [options={}] Optional. A set of custom options to overwrites the default ones
   *                              the class defines.
   * @return {AureliaExtractCleaner} A new instance of this class.
   */
  constructor(source, options = {}) {
    /**
     * A local reference to the HTML code the class received on the constructor.
     * @type {String}
     */
    this.source = source;
    /**
     * The setting options the class uses to look for tags to remove.
     * @type {Object}
     * @property {Array}  extensions     The list of file extensions the class will use to filter
     *                                   the tags to remove.
     * @property {String} attributeName  The name of the attribute that must be present on a
     *                                   `require` tag in order to be removed.
     * @property {String} attributeValue The value of the attribute that must be present on a
     *                                   `require` tag in order to be removed.
     */
    this.options = Object.assign({
      extensions: ['css', 'scss', 'sass', 'less'],
      attributeName: 'extract',
      attributeValue: 'true',
    }, options);
    /**
     * A set of useful regular expressions the class uses to look for tags and their attributes.
     * @type {Object}
     * @property {RegExp} requires   It searches for `require` tags that have a `from` attribute.
     * @property {RegExp} attributes Searches all the attributes and their values from an HTML tag.
     * @private
     * @ignore
     */
    this._regexs = {
      requires: /<require.+?from=\\?["|'].*?\\?["|'].*?><\/require>/ig,
      attributes: /(\S+)=\\?["']?((?:.(?!["']?\s+(?:\S+)=|\\?[>"']))+.)["']?/ig,
    };
  }
  /**
   * Searches for the `require` tags, validates them and removed them from the code.
   * @return {String} The HTML code without the extracted `require` tags.
   */
  process() {
    const requires = this._getRequires();
    if (requires.length) {
      const extracted = this._getTagsToExtract(requires);
      if (extracted.length) {
        this._removeExtractedTags(extracted);
      }
    }

    return this.source;
  }
  /**
   * Get one of the class regular expressions by its name. I don't like accessing private properties
   * without a method :P.
   * @param {String} name The name of the regular expression as it's declared on the `_regex`
   *                      property.
   * @return {RegExp}
   * @private
   * @ignore
   */
  _getRegex(name) {
    return this._regexs[name];
  }
  /**
   * Find all the `require` tags on the HTML provided on the class constructor.
   * @return {Array} This is the result of an iterable `.exec` call, so each item of the array is
   *                 a match from a regular expression.
   * @private
   * @ignore
   */
  _getRequires() {
    const regex = this._getRegex('requires');
    const tags = [];
    let match = regex.exec(this.source);
    while (match) {
      tags.push(match);
      match = regex.exec(this.source);
    }

    return tags;
  }
  /**
   * Given a list of tags (the result from `_getRequires`), this method will filter them by
   * validating its attributes against the class setting options (extension, and attribute name
   * and value).
   * @param {Array} tags A list of `require` tags generated by `_getRequires`.
   * @return {Array} A filtered list of the same received tags.
   * @private
   * @ignore
   */
  _getTagsToExtract(tags) {
    const { extensions, attributeName, attributeValue } = this.options;
    return tags.filter((tagMatch) => {
      const [tag] = tagMatch;
      const attrs = this._getTagAttributes(tag);
      const extension = attrs.from.split('.').pop().toLowerCase();
      const validExtension = attrs.from && extensions.includes(extension);
      const shouldExtract = attrs[attributeName] === attributeValue;
      return validExtension && shouldExtract;
    });
  }
  /**
   * Remove a list of `require` tags from the HTML code.
   * This method doesn't return anything because the change is made on the class `source` property.
   * @param {Array} tags The list of tags to remove (the actual string so it can be replaced by an
   *                     empty string).
   * @private
   * @ignore
   */
  _removeExtractedTags(tags) {
    tags.forEach((tag) => {
      this.source = this.source.replace(tag, '');
    });
  }
  /**
   * Get a dictionary with all the attributes a tag has.
   * @param {String} tag The HTML tag from where the attributes will be extracted.
   * @return {Object} A dictionary with the keys being the attributes names and the values the...
   *                  well, the attributes values :P.
   * @private
   * @ignore
   */
  _getTagAttributes(tag) {
    const regex = this._getRegex('attributes');
    const attrs = {};
    let match = regex.exec(tag);
    while (match) {
      const [, name, value] = match;
      attrs[name] = value;
      match = regex.exec(tag);
    }

    return attrs;
  }
}

module.exports = AureliaExtractCleaner;
