const AuthenticationRepository = require('../AuthenticationRepository');

describe('AuthenticationRepository interface', () => {
  it('should throw an error when invoking abstract behavior', async () => {
    // Arrange
    const authenticationRepository = new AuthenticationRepository();

    // Action and Assert
    await expect(authenticationRepository.addToken('')).rejects.toThrow('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(authenticationRepository.checkAvailabilityToken('')).rejects.toThrow('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(authenticationRepository.deleteToken('')).rejects.toThrow('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
