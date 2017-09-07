class AureliaExtractCleaner {

  constructor(source, options = {}) {
    this.source = source;
    this.options = Object.assign({
      extensions: ['css', 'scss', 'sass', 'less'],
      attributeName: 'extract',
      attributeValue: 'true',
    }, options);

    this._regexs = {
      requires: /<require.+?from=\\?["|'].*?\\?["|'].*?>(?:.+?)?<\/require>/ig,
      attributes: /(\S+)=\\?["']?((?:.(?!["']?\s+(?:\S+)=|\\?[>"']))+.)["']?/ig,
    };
  }

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

  _getRegex(name) {
    return this._regexs[name];
  }

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

  _removeExtractedTags(tags) {
    tags.forEach((tag) => {
      this.source = this.source.replace(tag, '');
    });
  }

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
