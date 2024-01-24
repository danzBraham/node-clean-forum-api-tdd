const bcrypt = require('bcrypt');
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError');
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
    it('should throw an AuthenticationError if password not match', async () => {
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

    it('should not throw an AuthenticationError if password match', async () => {
      // Arrange
      const spyCompare = jest.spyOn(bcrypt, 'compare');
      const bcryptPasswordHasher = new BcryptPasswordHasher(bcrypt);
      const password = 'plain-password';
      const encryptedPassword = await bcryptPasswordHasher.hash(password);

      // Action
      await expect(bcryptPasswordHasher.compare(password, encryptedPassword))
        .resolves
        .not.toThrow(AuthenticationError);
      expect(spyCompare).toHaveBeenCalledWith(password, encryptedPassword);
    });
  });
});
