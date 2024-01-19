const RegisteredUser = require('../RegisteredUser');

describe('RegisteredUser entity', () => {
  it('should throw an error if the payload does not contain the required properties', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      username: 'danzbraham',
    };

    // Action and Assert
    expect(() => new RegisteredUser(payload)).toThrow('REGISTERED_USER.NOT_CONTAIN_REQUIRED_PROPERTY');
  });

  it('should throw an error if the payload does not meet the data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 'danzbraham',
      fullname: true,
    };

    // Action and Assert
    expect(() => new RegisteredUser(payload)).toThrow('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create RegisteredUser entity correctly', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      username: 'danzbraham',
      fullname: 'Zidan Abraham',
    };

    // Action
    const registeredUser = new RegisteredUser(payload);

    // Assert
    expect(registeredUser.id).toEqual(payload.id);
    expect(registeredUser.username).toEqual(payload.username);
    expect(registeredUser.fullname).toEqual(payload.fullname);
  });
});
