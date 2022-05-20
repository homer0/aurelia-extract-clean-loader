jest.unmock('../src/index');

const AureliaExtractCleaner = require('../src/lib/aureliaExtractCleaner');
const loader = require('../src/index');

describe('aurelia-extract-clean-loader', () => {
  it('should instantiate AureliaExtractCleaner with the received source and options', () => {
    // Given
    const customCode = '<some-code />';
    const customOptions = {
      bruce: 'wayne',
      jason: 'todd',
    };
    const loaderContext = {
      getOptions: jest.fn(() => customOptions),
    };
    // When
    AureliaExtractCleaner.prototype.process.mockImplementationOnce(() => customCode);
    const processed = loader.apply(loaderContext, [customCode]);
    // Then
    expect(processed).toBe(customCode);
    expect(loaderContext.getOptions).toHaveBeenCalledTimes(1);
    expect(AureliaExtractCleaner).toHaveBeenCalledTimes(1);
    expect(AureliaExtractCleaner).toHaveBeenCalledWith(customCode, customOptions);
    expect(AureliaExtractCleaner.mock.instances.length).toBe(1);
    expect(AureliaExtractCleaner.mock.instances[0].process.mock.calls.length).toBe(1);
  });
});
