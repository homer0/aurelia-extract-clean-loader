jest.mock('loader-utils');
jest.unmock('/src/index');

require('jasmine-expect');
const loaderUtils = require('loader-utils');
const AureliaExtractCleaner = require('/src/lib/aureliaExtractCleaner');
const loader = require('/src/index');

describe('aurelia-extract-clean-loader', () => {
  it('should instantiate AureliaExtractCleaner with the received source and options', () => {
    // Given
    const customCode = '<some-code />';
    const customOptions = {
      bruce: 'wayne',
      jason: 'todd',
    };

    // When
    loaderUtils.getOptions.mockImplementationOnce(() => customOptions);
    AureliaExtractCleaner.prototype.process.mockImplementationOnce(() => customCode);
    const processed = loader(customCode);

    // Then
    expect(processed).toBe(customCode);
    expect(loaderUtils.getOptions.mock.calls.length).toBe(1);
    expect(AureliaExtractCleaner.mock.calls.length).toBe(1);
    expect(AureliaExtractCleaner.mock.calls[0].length).toBe(2);
    expect(AureliaExtractCleaner.mock.calls[0][0]).toBe(customCode);
    expect(AureliaExtractCleaner.mock.calls[0][1]).toEqual(customOptions);
    expect(AureliaExtractCleaner.mock.instances.length).toBe(1);
    expect(AureliaExtractCleaner.mock.instances[0].process.mock.calls.length).toBe(1);
  });
});
