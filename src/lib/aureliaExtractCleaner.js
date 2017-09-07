class AureliaExtractCleaner {

  constructor(source, options) {
    this.source = source;
    this.options = Object.assign({
      extensions: ['css', 'scss', 'sass', 'less'],
      attribute: {
        name: 'extract',
        value: 'true',
      },
    }, options);

    this._regexs = {
      requires: /<require.+?from=\\?["|'].*?\\?["|'].*?>(?:.+?)?<\/require>/ig,
      attributes: /(\S+)=\\\\?["']?((?:.(?!["']?\s+(?:\S+)=|\\\\?[>"']))+.)["']?/ig,
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
    const { extensions, attribute } = this.options;
    return tags.filter((tagMatch) => {
      const [tag] = tagMatch;
      const attrs = this._getTagAttributes(tag);
      const extension = attrs.from.split('.').pop().toLowerCase();
      const validExtension = attrs.from && extensions.includes(extension);
      const shouldExtract = attrs[attribute.name] === attribute.value;
      return validExtension && shouldExtract;
    });
  }

  _removeExtractedTags(tags) {
    console.log('\n==================================\n');
    console.log('\nBEFORE: ', this.source);
    tags.forEach((tag) => {
      this.source = this.source.replace(tag, '');
    });
    console.log('\nAFTER: ', this.source);
    console.log('\n==================================\n');
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
