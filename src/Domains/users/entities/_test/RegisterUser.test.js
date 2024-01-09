const RegisterUser = require('../RegisterUser');

describe('a RegisterUser entity', () => {
  it('should throw an error when the payload does not contain the required properties', () => {
    // Arrange
    const payload = {
      username: 'danzbraham',
      password: 'secret',
    };

    // Action and Assert
    expect(() => new RegisterUser(payload)).toThrow('REGISTER_USER.NOT_CONTAIN_REQUIRED_PROPERTY');
  });

  it('should throw an error when the payload does not meet the data type specification', () => {
    // Arrange
    const payload = {
      username: 'danzbraham',
      fullname: true,
      password: 123,
    };

    // Action and Assert
    expect(() => new RegisterUser(payload)).toThrow('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw an error when the username has more than 50 characters', () => {
    // Arrange
    const payload = {
      username: 'danzbrahamdanzbrahamdanzbrahamdanzbrahamdanzbrahamdanzbraham',
      fullname: 'Zidan Abraham',
      password: 'secret',
    };

    // Action and Assert
    expect(() => new RegisterUser(payload)).toThrow('REGISTER_USER.USERNAME_LIMIT_CHAR');
  });

  it('should throw an error when the username has a restricted character', () => {
    // Arrange
    const payload = {
      username: 'danz braham',
      fullname: 'Zidan Abraham',
      password: 'secret',
    };

    // Action and Assert
    expect(() => new RegisterUser(payload)).toThrow('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER');
  });
});
