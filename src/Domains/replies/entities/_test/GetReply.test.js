const GetReply = require('../GetReply');

describe('GetReply', () => {
  it('should throw an error if the payload does not contain the required properties', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      username: 'danzbraham',
      date: '2024',
      content: 'Reply to a comment',
    };

    // Action & Assert
    expect(() => new GetReply(payload)).toThrow('GET_REPLY.NOT_CONTAIN_REQUIRED_PROPERTY');
  });

  it('should throw an error if the payload does not meet the data type specification', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      username: 'danzbraham',
      date: 2024,
      content: 'Reply to a comment',
      is_deleted: false,
    };

    // Action & Assert
    expect(() => new GetReply(payload)).toThrow('GET_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create correct GetReply entity for a non-deleted reply', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      username: 'danzbraham',
      date: '2024',
      content: 'Reply to a comment',
      is_deleted: false,
    };

    // Action
    const getReply = new GetReply(payload);

    // Assert
    expect(getReply).toBeInstanceOf(GetReply);
    expect(getReply.id).toEqual(payload.id);
    expect(getReply.username).toEqual(payload.username);
    expect(getReply.date).toEqual(payload.date);
    expect(getReply.content).toEqual(payload.content);
  });

  it('should create correct GetReply entity for a deleted reply', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      username: 'danzbraham',
      date: '2024',
      content: '**balasan telah dihapus**',
      is_deleted: true,
    };

    // Action
    const getReply = new GetReply(payload);

    // Assert
    expect(getReply).toBeInstanceOf(GetReply);
    expect(getReply.id).toEqual(payload.id);
    expect(getReply.username).toEqual(payload.username);
    expect(getReply.date).toEqual(payload.date);
    expect(getReply.content).toEqual(payload.content);
  });
});
