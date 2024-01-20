const LoginUser = require('../LoginUser');

describe('LoginUser entity', () => {
  it('should throw an error if the payload does not contain the required properties', () => {
    // Arrange
    const payload = {
      username: 'danzbraham',
    };

    // Action and Assert
    expect(() => new LoginUser(payload)).toThrow('USER_LOGIN.NOT_CONTAIN_REQUIRED_PROPERTY');
  });

  it('should throw an error if the payload does not meet the data type specification', () => {
    // Arrange
    const payload = {
      username: 'danzbraham',
      password: 123456,
    };

    // Action and Assert
    expect(() => new LoginUser(payload)).toThrow('USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create LoginUser entity correctly', () => {
    // Arrange
    const payload = {
      username: 'danzbraham',
      password: '123456',
    };

    // Action

    const loginUser = new LoginUser(payload);

    // Assert
    expect(loginUser).toBeInstanceOf(LoginUser);
    expect(loginUser.username).toEqual(payload.username);
    expect(loginUser.password).toEqual(payload.password);
  });
});
