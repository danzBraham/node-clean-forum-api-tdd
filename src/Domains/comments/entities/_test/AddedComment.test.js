const AddedComment = require('../AddedComment');

describe('AddedComment', () => {
  it('should throw an error if the payload does not contain the required properties', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      content: 'Comment in thread',
    };

    // Action & Assert
    expect(() => new AddedComment(payload)).toThrow('ADDED_COMMENT.NOT_CONTAIN_REQUIRED_PROPERTY');
  });

  it('should throw an error if the payload does not meet the data type specification', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      content: 'Comment in thread',
      owner: 123,
    };

    // Action & Assert
    expect(() => new AddedComment(payload)).toThrow('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedComment entity correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'Comment in thread',
      owner: 'user-123',
    };

    // Action
    const addedComment = new AddedComment(payload);

    // Assert
    expect(addedComment).toBeInstanceOf(AddedComment);
    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(payload.owner);
  });
});
