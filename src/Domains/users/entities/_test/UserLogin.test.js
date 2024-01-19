const UserLogin = require('../UserLogin');

describe('UserLogin entity', () => {
  it('should throw an error if the payload does not contain the required properties', () => {
    // Arrange
    const payload = {
      username: 'danzbraham',
    };

    // Action and Assert
    expect(() => new UserLogin(payload)).toThrow('USER_LOGIN.NOT_CONTAIN_REQUIRED_PROPERTY');
  });

  it('should throw an error if the payload does not meet the data type specification', () => {
    // Arrange
    const payload = {
      username: 'danzbraham',
      password: 123456,
    };

    // Action and Assert
    expect(() => new UserLogin(payload)).toThrow('USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create UserLogin entity correctly', () => {
    // Arrange
    const payload = {
      username: 'danzbraham',
      password: '123456',
    };

    // Action

    const userLogin = new UserLogin(payload);

    // Assert
    expect(userLogin).toBeInstanceOf(UserLogin);
    expect(userLogin.username).toEqual(payload.username);
    expect(userLogin.password).toEqual(payload.password);
  });
});
