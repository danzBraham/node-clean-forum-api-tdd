const AddedReply = require('../AddedReply');

describe('AddedReply', () => {
  it('should throw an error when the payload does not contain the required properties', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'Reply to a comment',
    };

    // Action & Assert
    expect(() => new AddedReply(payload)).toThrow('ADDED_REPLY.NOT_CONTAIN_REQUIRED_PROPERTY');
  });

  it('should throw an error when the payload does not meet the data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'Reply to a comment',
      owner: 123,
    };

    // Action & Assert
    expect(() => new AddedReply(payload)).toThrow('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedReply entity correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'Reply to a comment',
      owner: 'user-123',
    };

    // Action
    const addedReplAddedReply = new AddedReply(payload);

    // Assert
    expect(addedReplAddedReply).toBeInstanceOf(AddedReply);
    expect(addedReplAddedReply.id).toEqual(payload.id);
    expect(addedReplAddedReply.content).toEqual(payload.content);
    expect(addedReplAddedReply.owner).toEqual(payload.owner);
  });
});
