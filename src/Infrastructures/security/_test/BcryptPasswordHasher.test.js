const bcrypt = require('bcrypt');
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
});
