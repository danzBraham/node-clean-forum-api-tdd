const InvariantError = require('../../../Commons/InvariantError');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const pool = require('../../database/postgres/pool');
const AuthenticationRepositoryPostgres = require('../AuthenticationRepositoryPostgres');

describe('AuthenticationRepositoryPostgres', () => {
  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addToken function', () => {
    it('should add token to the database correctly', async () => {
      // Arrange
      const token = 'token';
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool);

      // Action
      await authenticationRepositoryPostgres.addToken(token);

      // Assert
      const tokens = await AuthenticationsTableTestHelper.findToken(token);
      expect(tokens).toHaveLength(1);
      expect(tokens[0].token).toEqual(token);
    });
  });

  describe('checkAvailabilityToken function', () => {
    it('should throw an InvariantError when token is not available', async () => {
      // Arrange
      const token = 'token';
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool);

      // Action & Assert
      await expect(authenticationRepositoryPostgres.checkAvailabilityToken(token))
        .rejects.toThrow(InvariantError);
    });

    it('should not throw an InvariantError when token is available', async () => {
      // Arrange
      const token = 'token';
      await AuthenticationsTableTestHelper.addToken(token);
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool);

      // Action & Assert
      await expect(authenticationRepositoryPostgres.checkAvailabilityToken(token))
        .resolves.not.toThrow(InvariantError);
    });
  });

  describe('deleteToken function', () => {
    it('should delete token from the database correctly', async () => {
      // Arrange
      const token = 'token';
      await AuthenticationsTableTestHelper.addToken(token);
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool);

      // Action
      await authenticationRepositoryPostgres.deleteToken(token);

      // Assert
      const tokens = await AuthenticationsTableTestHelper.findToken(token);
      expect(tokens).toHaveLength(0);
    });
  });
});
