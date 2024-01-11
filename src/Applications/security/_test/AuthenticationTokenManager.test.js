const AuthenticationTokenManager = require('../AuthenticationTokenManager');

describe('AuthenticationTokenManager', () => {
  it('should throw an error when invoking abstract behavior', async () => {
    // Arrange
    const tokenManager = new AuthenticationTokenManager();

    // Action & Assert
    await expect(tokenManager.createAccessToken({})).rejects.toThrow('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
    await expect(tokenManager.createRefreshToken({})).rejects.toThrow('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
    await expect(tokenManager.verifyRefreshToken('')).rejects.toThrow('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
    await expect(tokenManager.decodePayload('')).rejects.toThrow('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  });
});
