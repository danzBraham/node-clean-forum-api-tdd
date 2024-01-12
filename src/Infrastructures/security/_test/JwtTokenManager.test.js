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
      const spyGenerate = jest.spyOn(Jwt.token, 'generate');
      const jwtTokenManager = new JwtTokenManager(Jwt.token);

      // Action
      const accessToken = await jwtTokenManager.createAccessToken(payload);

      // Assert
      expect(typeof accessToken).toEqual('string');
      expect(spyGenerate).toHaveBeenCalledWith(payload, process.env.ACCESS_TOKEN_KEY);
    });
  });

  describe('createRefreshToken function', () => {
    it('should create refresh token correctly', async () => {
      // Arrange
      const payload = {
        id: 'user-123',
        username: 'danzbraham',
      };
      const spyGenerate = jest.spyOn(Jwt.token, 'generate');
      const jwtTokenManager = new JwtTokenManager(Jwt.token);

      // Action
      const refreshToken = await jwtTokenManager.createRefreshToken(payload);

      // Assert
      expect(typeof refreshToken).toEqual('string');
      expect(spyGenerate).toHaveBeenCalledWith(payload, process.env.REFRESH_TOKEN_KEY);
    });
  });

  describe('decodePayload function', () => {
    it('should decode payload correctly', async () => {
      // Arrange
      const payload = {
        id: 'user-123',
        username: 'danzbraham',
      };
      const spyDecode = jest.spyOn(Jwt.token, 'decode');
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken(payload);

      // Action
      const decodedPayload = await jwtTokenManager.decodePayload(accessToken);

      // Assert
      expect(decodedPayload.id).toEqual(payload.id);
      expect(decodedPayload.username).toEqual(payload.username);
      expect(spyDecode).toHaveBeenCalledWith(accessToken);
    });
  });

  describe('verifyRefreshToken function', () => {
    it('should throw an InvariantError when refresh token is invalid', async () => {
      // Arrange
      const spyDecode = jest.spyOn(Jwt.token, 'decode');
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const refreshToken = 'invalid-refresh-token';

      // Action & Assert
      await expect(jwtTokenManager.verifyRefreshToken(refreshToken))
        .rejects
        .toThrow(InvariantError);
      expect(spyDecode).toHaveBeenCalledWith(refreshToken);
    });

    it('should not throw an InvariantError when refresh token is valid', async () => {
      // Arrange
      const payload = {
        id: 'user-123',
        username: 'danzbraham',
      };
      const spyDecode = jest.spyOn(Jwt.token, 'decode');
      const spyVerify = jest.spyOn(Jwt.token, 'verify');
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const refreshToken = await jwtTokenManager.createRefreshToken(payload);
      const artifacts = Jwt.token.decode(refreshToken);

      // Action & Assert
      await expect(jwtTokenManager.verifyRefreshToken(refreshToken))
        .resolves
        .not.toThrow(InvariantError);
      expect(spyDecode).toHaveBeenCalledWith(refreshToken);
      expect(spyVerify).toHaveBeenCalledWith(artifacts, process.env.REFRESH_TOKEN_KEY);
    });
  });
});
