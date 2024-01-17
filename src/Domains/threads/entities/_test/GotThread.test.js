const GotThread = require('../GotThread');

describe('GotThread', () => {
  it('should throw an error if the returned value does not contain the required properties', () => {
    // Arrange
    const returnedValue = {
      id: 'thread-123',
      title: 'My Thread',
      body: 'Hello this is my Thread',
      date: '2024',
    };

    // Action & Assert
    expect(() => new GotThread(returnedValue)).toThrow('GOT_THREAD.NOT_CONTAIN_REQUIRED_PROPERTY');
  });

  it('should throw an error if the returned value does not meet the data type specification', () => {
    // Arrange
    const returnedValue = {
      id: 'thread-123',
      title: 'My Thread',
      body: 'Hello this is my Thread',
      date: '2024',
      username: true,
      comments: [],
    };

    // Action & Assert
    expect(() => new GotThread(returnedValue)).toThrow('GOT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create GotThread entity correctly', () => {
    // Arrange
    const returnedValue = {
      id: 'thread-123',
      title: 'My Thread',
      body: 'Hello this is my Thread',
      date: '2024',
      username: 'danzbraham',
      comments: [{}, {}, {}],
    };

    // Action
    const gotThread = new GotThread(returnedValue);

    // Assert
    expect(gotThread).toBeInstanceOf(GotThread);
    expect(gotThread.id).toEqual(returnedValue.id);
    expect(gotThread.title).toEqual(returnedValue.title);
    expect(gotThread.body).toEqual(returnedValue.body);
    expect(gotThread.date).toEqual(returnedValue.date);
    expect(gotThread.username).toEqual(returnedValue.username);
    expect(gotThread.comments).toEqual(returnedValue.comments);
  });
});
