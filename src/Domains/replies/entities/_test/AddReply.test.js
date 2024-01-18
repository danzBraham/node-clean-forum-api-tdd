const AddReply = require('../AddReply');

describe('AddReply', () => {
  it('should throw an error when the payload does not contain the required properties', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
      content: 'Reply to a comment',
    };

    // Action & Assert
    expect(() => new AddReply(payload)).toThrow('ADD_REPLY.NOT_CONTAIN_REQUIRED_PROPERTY');
  });

  it('should throw an error when the payload does not meet the data type specification', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
      commentId: 123,
      content: 'Reply to a comment',
    };

    // Action & Assert
    expect(() => new AddReply(payload)).toThrow('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddReply entity correctly', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
      commentId: 'comment-123',
      content: 'Comment in thread',
    };

    // Action
    const addReply = new AddReply(payload);

    // Assert
    expect(addReply).toBeInstanceOf(AddReply);
    expect(addReply.userId).toEqual(payload.userId);
    expect(addReply.commentId).toEqual(payload.commentId);
    expect(addReply.content).toEqual(payload.content);
  });
});
