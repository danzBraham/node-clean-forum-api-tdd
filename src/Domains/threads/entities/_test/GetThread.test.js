const GetThread = require('../GetThread');

describe('GetThread', () => {
  it('should throw an error if the returned value does not contain the required properties', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'My Thread',
      body: 'Hello this is my Thread',
      date: '2024',
    };

    // Action & Assert
    expect(() => new GetThread(payload)).toThrow('GET_THREAD.NOT_CONTAIN_REQUIRED_PROPERTY');
  });

  it('should throw an error if the returned value does not meet the data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'My Thread',
      body: 'Hello this is my Thread',
      date: '2024',
      username: true,
      comments: [],
    };

    // Action & Assert
    expect(() => new GetThread(payload)).toThrow('GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create GetThread entity correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'My Thread',
      body: 'Hello this is my Thread',
      date: '2024',
      username: 'danzbraham',
      comments: [],
    };

    // Action
    const getThread = new GetThread(payload);

    // Assert
    expect(getThread).toBeInstanceOf(GetThread);
    expect(getThread.id).toEqual(payload.id);
    expect(getThread.title).toEqual(payload.title);
    expect(getThread.body).toEqual(payload.body);
    expect(getThread.date).toEqual(payload.date);
    expect(getThread.username).toEqual(payload.username);
    expect(getThread.comments).toEqual(payload.comments);
  });
});
