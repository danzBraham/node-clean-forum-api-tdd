const Jwt = require('@hapi/jwt');
const InvariantError = require('../../../Commons/InvariantError');
const JwtTokenManager = require('../JwtTokenManager');

describe('JwtTokenManager', () => {
  describe('createAccessToken function', () => {
    it('should create access token correctly', async () => {
      // Arrange
      const payload = {
        id: 'user-123',
        username: 'danzbraham',
      };
      const mockJwtToken = {
        generate: jest.fn().mockImplementation(() => Promise.resolve('mock-token')),
      };
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      // Action
      const accessToken = await jwtTokenManager.createAccessToken(payload);

      // Assert
      expect(accessToken).toEqual('mock-token');
      expect(mockJwtToken.generate).toHaveBeenCalledWith(payload, process.env.ACCESS_TOKEN_KEY);
    });
  });

  describe('createRefreshToken function', () => {
    it('should create refresh token correctly', async () => {
      // Arrange
      const payload = {
        id: 'user-123',
        username: 'danzbraham',
      };
      const mockJwtToken = {
        generate: jest.fn().mockImplementation(() => Promise.resolve('mock-token')),
      };
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      // Action
      const refreshToken = await jwtTokenManager.createRefreshToken(payload);

      // Assert
      expect(refreshToken).toEqual('mock-token');
      expect(mockJwtToken.generate).toHaveBeenCalledWith(payload, process.env.REFRESH_TOKEN_KEY);
    });
  });

  describe('decodePayload function', () => {
    it('should decode payload correctly', async () => {
      // Arrange
      const payload = {
        id: 'user-123',
        username: 'danzbraham',
      };
      const accessToken = 'access-token';
      const mockJwtToken = {
        decode: jest.fn().mockImplementation(() => Promise.resolve({ decoded: { payload } })),
      };
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      // Action
      const decodedPayload = await jwtTokenManager.decodePayload(accessToken);

      // Assert
      expect(decodedPayload.id).toEqual(payload.id);
      expect(decodedPayload.username).toEqual(payload.username);
      expect(mockJwtToken.decode).toHaveBeenCalledWith(accessToken);
    });
  });

  describe('verifyRefreshToken function', () => {
    it('should throw an InvariantError when refresh token is invalid', async () => {
      // Arrange
      const payload = {
        id: 'user-123',
        username: 'danzbraham',
      };
      const refreshToken = 'refresh-token';
      const mockJwtToken = {
        decode: jest.fn().mockImplementation(() => Promise.resolve({ decoded: { payload } })),
        verify: jest.fn().mockImplementation(() => Promise.reject()),
      };
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      // Action & Assert
      await expect(jwtTokenManager.verifyRefreshToken(refreshToken))
        .rejects
        .toThrow(InvariantError);
    });

    it('should not throw an InvariantError when refresh token is valid', async () => {
      // Arrange
      const payload = {
        id: 'user-123',
        username: 'danzbraham',
      };
      const refreshToken = 'refresh-token';
      const mockJwtToken = {
        decode: jest.fn().mockImplementation(() => Promise.resolve({ decoded: { payload } })),
        verify: jest.fn().mockImplementation(() => Promise.resolve()),
      };
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      // Action & Assert
      await expect(jwtTokenManager.verifyRefreshToken(refreshToken))
        .resolves
        .not.toThrow(InvariantError);
    });
  });
});
