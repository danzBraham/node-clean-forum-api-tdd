const DeleteReply = require('../DeleteReply');

describe('DeleteReply', () => {
  it('should throw an error when the payload does not contain the required properties', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
    };

    // Action & Assert
    expect(() => new DeleteReply(payload)).toThrow('DELETE_REPLY.NOT_CONTAIN_REQUIRED_PROPERTY');
  });

  it('should throw an error when the payload does not meet the data type specification', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
      commentId: 123,
      replyId: 'reply-123',
    };

    // Action & Assert
    expect(() => new DeleteReply(payload)).toThrow('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DeleteReply entity correctly', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
    };

    // Action
    const deleteReplDeleteReply = new DeleteReply(payload);

    // Assert
    expect(deleteReplDeleteReply).toBeInstanceOf(DeleteReply);
    expect(deleteReplDeleteReply.userId).toEqual(payload.userId);
    expect(deleteReplDeleteReply.commentId).toEqual(payload.commentId);
    expect(deleteReplDeleteReply.replyId).toEqual(payload.replyId);
  });
});
