const AddThread = require('../AddThread');

describe('AddThread', () => {
  it('should throw an error when the payload does not contain the required properties', () => {
    // Arrange
    const payload = {
      title: 'My Thread',
    };

    // Action & Assert
    expect(() => new AddThread(payload)).toThrow('ADD_THREAD.NOT_CONTAIN_REQUIRED_PROPERTY');
  });

  it('should throw an error when the payload does not meet the data type specification', () => {
    // Arrange
    const payload = {
      title: 'My Thread',
      body: [true],
    };

    // Action & Assert
    expect(() => new AddThread(payload)).toThrow('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddThread entity correctly', () => {
    // Arrange
    const payload = {
      title: 'My Thread',
      body: 'Hello this is my Thread',
    };

    // Action
    const addThread = new AddThread(payload);

    // Assert
    expect(addThread).toBeInstanceOf(AddThread);
    expect(addThread.title).toEqual(payload.title);
    expect(addThread.body).toEqual(payload.body);
  });
});
