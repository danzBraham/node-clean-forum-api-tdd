const AddComment = require('../AddComment');

describe('AddComment', () => {
  it('should throw an error when the payload does not contain the required properties', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
      content: 'Comment in thread',
    };

    // Action & Assert
    expect(() => new AddComment(payload)).toThrow('ADD_COMMENT.NOT_CONTAIN_REQUIRED_PROPERTY');
  });

  it('should throw an error when the payload does not meet the data type specification', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
      threadId: 123,
      content: 'Comment in thread',
    };

    // Action & Assert
    expect(() => new AddComment(payload)).toThrow('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddComment entity correctly', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
      threadId: 'thread-123',
      content: 'Comment in thread',
    };

    // Action
    const addComment = new AddComment(payload);

    // Assert
    expect(addComment).toBeInstanceOf(AddComment);
    expect(addComment.userId).toEqual(payload.userId);
    expect(addComment.threadId).toEqual(payload.threadId);
    expect(addComment.content).toEqual(payload.content);
  });
});
