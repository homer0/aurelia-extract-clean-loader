jest.unmock('../../src/lib/aureliaExtractCleaner');

const AureliaExtractCleaner = require('../../src/lib/aureliaExtractCleaner');

describe('AureliaExtractCleaner', () => {
  it("should be a class and only available using 'new'", () => {
    // Given
    // When
    expect(() => {
      AureliaExtractCleaner('', {});
    })
      // Then
      .toThrow("Class constructor AureliaExtractCleaner cannot be invoked without 'new'");
  });

  it('should be able to use default options', () => {
    // Given/When
    const cleaner = new AureliaExtractCleaner('code');
    // Then
    expect(cleaner.options).toEqual({
      extensions: ['css', 'scss', 'sass', 'less'],
      attributeName: 'extract',
      attributeValue: 'true',
    });
  });

  it('should be able to overwrite the options', () => {
    // Given
    const customOptions = {
      extensions: ['jsx', 'mp4'],
      attributeName: 'custom-name',
      attributeValue: 'custom-value',
    };
    // When
    const cleaner = new AureliaExtractCleaner('code', customOptions);
    // Then
    expect(cleaner.options).toEqual(customOptions);
  });

  it('should remove a stylesheet require tag from a template', () => {
    // Given
    const customCode = 'bat<require from="file.scss" extract="true"></require>man';
    const cleaner = new AureliaExtractCleaner(customCode);
    // When
    const processed = cleaner.process();
    // Then
    expect(processed).toBe('batman');
  });

  it('should remove require tags with custom extensions', () => {
    // Given
    const customOptions = {
      extensions: ['txt', 'png'],
    };
    const customCode = `
      <require from="some/path/to/file.txt" extract="true"></require>
      batman
      <require from="some/other/path/to/file.png" extract="true"></require>
    `;
    // When
    const cleaner = new AureliaExtractCleaner(customCode, customOptions);
    const processed = cleaner.process().trim();
    // Then
    expect(processed).toBe('batman');
  });

  it('should remove require tags with a custom extract attribute', () => {
    // Given
    const customOptions = {
      attributeName: 'bruce',
      attributeValue: 'wayne',
    };
    const customCode = `
      bat<require from="some/path/to/file.scss" bruce="wayne"></require>man
      <require from="some/other/path/to/file.png" extract="true"></require>
    `;
    // When
    const cleaner = new AureliaExtractCleaner(customCode, customOptions);
    const processed = cleaner.process().trim();
    // Then
    expect(processed).toBe(
      `
      batman
      <require from="some/other/path/to/file.png" extract="true"></require>
    `.trim(),
    );
  });

  it("shouldn't remove a tag located after one to remove", () => {
    // Given
    const tagToIgnore = '<require from="some/other/path/to/file.scss"></require>';
    const customCode = `
      <require from="some/path/to/file.scss" extract="true"></require>
      ${tagToIgnore}
    `;
    // When
    const cleaner = new AureliaExtractCleaner(customCode);
    const processed = cleaner.process().trim();
    // Then
    expect(processed).toBe(tagToIgnore);
  });

  it("shouldn't change the code if there are no require tags", () => {
    // Given
    const customCode = '<gotham>Batman</gotham>';
    // When
    const cleaner = new AureliaExtractCleaner(customCode);
    const processed = cleaner.process();
    // Then
    expect(processed).toBe(customCode);
  });

  it('shouldnt change the code if there are no require tags with the extract attribute', () => {
    // Given
    const customCode = '<require from="file.scss"></require>';
    // When
    const cleaner = new AureliaExtractCleaner(customCode);
    const processed = cleaner.process();
    // Then
    expect(processed).toBe(customCode);
  });
});
