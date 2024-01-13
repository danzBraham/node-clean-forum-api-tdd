const AddedThread = require('../AddedThread');

describe('AddedThread', () => {
  it('should throw an error when the payload does not contain the required properties', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'My Thread',
    };

    // Action & Assert
    expect(() => new AddedThread(payload)).toThrow('ADDED_THREAD.NOT_CONTAIN_REQUIRED_PROPERTY');
  });

  it('should throw an error when the payload does not meet the data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'My Thread',
      owner: [true],
    };

    // Action & Assert
    expect(() => new AddedThread(payload)).toThrow('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedThread entity correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'My Thread',
      owner: 'user-123',
    };

    // Action
    const addedThread = new AddedThread(payload);

    // Assert
    expect(addedThread).toBeInstanceOf(AddedThread);
    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.owner).toEqual(payload.owner);
  });
});
