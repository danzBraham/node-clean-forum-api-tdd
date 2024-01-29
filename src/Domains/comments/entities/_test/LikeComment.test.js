const LikeComment = require('../LikeComment');

describe('LikeComment', () => {
  it('should throw an error if the payload does not contain the required properties', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
    };

    // Action & Assert
    expect(() => new LikeComment(payload)).toThrow('LIKE_COMMENT.NOT_CONTAIN_REQUIRED_PROPERTY');
  });

  it('should throw an error if the payload does not meet the data type specification', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 123,
    };

    // Action & Assert
    expect(() => new LikeComment(payload)).toThrow('LIKE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create LikeComment entity correctly', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    // Action
    const likeComment = new LikeComment(payload);

    // Assert
    expect(likeComment).toBeInstanceOf(LikeComment);
    expect(likeComment.userId).toEqual(payload.userId);
    expect(likeComment.threadId).toEqual(payload.threadId);
    expect(likeComment.commentId).toEqual(payload.commentId);
  });
});
