const PasswordHasher = require('../PasswordHasher');

describe('PasswordHash interface', () => {
  it('should throw an error when invoking abstract behavior', async () => {
    // Arrange
    const passwordHasher = new PasswordHasher();

    // Action & Assert
    await expect(passwordHasher.hash('dummy-password')).rejects.toThrow('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
    await expect(passwordHasher.compare('plain', 'encrypted')).rejects.toThrow('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
  });
});
