const DeleteComment = require('../DeleteComment');

describe('DeleteComment', () => {
  it('should throw an error if the payload does not contain the required properties', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
    };

    // Action & Assert
    expect(() => new DeleteComment(payload)).toThrow('DELETE_COMMENT.NOT_CONTAIN_REQUIRED_PROPERTY');
  });

  it('should throw an error if the payload does not meet the data type specification', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
      threadId: 123,
      commentId: 'comment-123',
    };

    // Action & Assert
    expect(() => new DeleteComment(payload)).toThrow('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DeleteComment entity correctly', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    // Action
    const deleteComment = new DeleteComment(payload);

    // Assert
    expect(deleteComment).toBeInstanceOf(DeleteComment);
    expect(deleteComment.userId).toEqual(payload.userId);
    expect(deleteComment.threadId).toEqual(payload.threadId);
    expect(deleteComment.commentId).toEqual(payload.commentId);
  });
});
