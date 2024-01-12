const bcrypt = require('bcrypt');
const AuthenticationError = require('../../../Commons/AuthenticationError');
const BcryptPasswordHasher = require('../BcryptPasswordHasher');

describe('BcryptPasswordHasher', () => {
  describe('hash function', () => {
    it('should encrypt password correctly', async () => {
      // Arrange
      const spyHash = jest.spyOn(bcrypt, 'hash');
      const bcryptPasswordHasher = new BcryptPasswordHasher(bcrypt);

      // Action
      const encryptedPassword = await bcryptPasswordHasher.hash('plain-password');

      // Assert
      expect(typeof encryptedPassword).toEqual('string');
      expect(encryptedPassword).not.toEqual('plain-password');
      expect(spyHash).toHaveBeenCalledWith('plain-password', 10);
    });
  });

  describe('compare function', () => {
    it('should throw an AuthenticationError when comparing incorrect passwords', async () => {
      // Arrange
      const spyCompare = jest.spyOn(bcrypt, 'compare');
      const bcryptPasswordHasher = new BcryptPasswordHasher(bcrypt);
      const password = 'plain-password';
      const encryptedPassword = 'encrypted-password';

      // Action
      await expect(bcryptPasswordHasher.compare(password, encryptedPassword))
        .rejects
        .toThrow(AuthenticationError);
      expect(spyCompare).toHaveBeenCalledWith(password, encryptedPassword);
    });

    it('should not throw an AuthenticationError when comparing correct passwords', async () => {
      // Arrange
      const spyCompare = jest.spyOn(bcrypt, 'compare');
      const bcryptPasswordHasher = new BcryptPasswordHasher(bcrypt);
      const password = 'plain-password';
      const encryptedPassword = await bcrypt.hash(password, 10);

      // Action
      await expect(bcryptPasswordHasher.compare(password, encryptedPassword))
        .resolves
        .not.toThrow(AuthenticationError);
      expect(spyCompare).toHaveBeenCalledWith(password, encryptedPassword);
    });
  });
});
