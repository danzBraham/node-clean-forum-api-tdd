const ClientError = require('../ClientError');

describe('ClientError', () => {
  it('should throw an error when directly using it', () => {
    expect(() => new ClientError('')).toThrow('cannot instantiate abstract class');
  });
});
