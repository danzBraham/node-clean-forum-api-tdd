const AuthenticationError = require('../../Commons/exceptions/AuthenticationError');
const PasswordHasher = require('../../Applications/security/PasswordHasher');

class BcryptPasswordHasher extends PasswordHasher {
  constructor(bcrypt, saltRound = 10) {
    super();
    this._bcrypt = bcrypt;
    this._saltRound = saltRound;
  }

  async hash(password) {
    return this._bcrypt.hash(password, this._saltRound);
  }

  async compare(password, encryptedPassword) {
    const result = await this._bcrypt.compare(password, encryptedPassword);

    if (!result) {
      throw new AuthenticationError('invalid password');
    }
  }
}

module.exports = BcryptPasswordHasher;
