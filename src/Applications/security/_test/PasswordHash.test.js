const PassworddHash = require('../PasswordHash');

describe('a PasswordHash interface', () => {
  it('should throw an error when invoking abstract behavior', async () => {
    // Arrange
    const passworddHash = new PassworddHash();

    // Action and Assert
    await expect(passworddHash.hash('')).rejects.toThrow('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
  });
});
