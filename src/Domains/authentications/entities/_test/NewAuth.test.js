const NewAuth = require('../NewAuth');

describe('NewAuth entity', () => {
  it('should throw an error if the payload does not contain the required properties', () => {
    // Arrange
    const payload = {
      accessToken: 'access-token',
    };

    // Action and Assert
    expect(() => new NewAuth(payload)).toThrow('NEW_AUTH.NOT_CONTAIN_REQUIRED_PROPERTY');
  });

  it('should throw an error if the payload does not meet the data type specification', () => {
    // Arrange
    const payload = {
      accessToken: 'access-token',
      refreshToken: true,
    };

    // Action and Assert
    expect(() => new NewAuth(payload)).toThrow('NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewAuth entity correctly', () => {
    // Arrange
    const payload = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    };

    // Action
    const newAuth = new NewAuth(payload);

    // Assert
    expect(newAuth).toBeInstanceOf(NewAuth);
    expect(newAuth.accessToken).toEqual(payload.accessToken);
    expect(newAuth.refreshToken).toEqual(payload.refreshToken);
  });
});
