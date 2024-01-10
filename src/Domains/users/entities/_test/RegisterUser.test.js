const RegisterUser = require('../RegisterUser');

describe('RegisterUser entity', () => {
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
      password: 123,
      fullname: true,
    };

    // Action and Assert
    expect(() => new RegisterUser(payload)).toThrow('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw an error when the username has more than 50 characters', () => {
    // Arrange
    const payload = {
      username: 'danzbrahamdanzbrahamdanzbrahamdanzbrahamdanzbrahamdanzbraham',
      password: 'secret',
      fullname: 'Zidan Abraham',
    };

    // Action and Assert
    expect(() => new RegisterUser(payload)).toThrow('REGISTER_USER.USERNAME_LIMIT_CHAR');
  });

  it('should throw an error when the username has a restricted character', () => {
    // Arrange
    const payload = {
      username: 'danz braham',
      password: 'secret',
      fullname: 'Zidan Abraham',
    };

    // Action and Assert
    expect(() => new RegisterUser(payload)).toThrow('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER');
  });

  it('should create RegisterUser entity correctly', () => {
    // Arrange
    const payload = {
      username: 'danzbraham',
      password: 'secret',
      fullname: 'Zidan Abraham',
    };

    // Action
    const registerUser = new RegisterUser(payload);

    // Assert
    expect(registerUser).toBeInstanceOf(RegisterUser);
    expect(registerUser.username).toEqual(payload.username);
    expect(registerUser.password).toEqual(payload.password);
    expect(registerUser.fullname).toEqual(payload.fullname);
  });
});
