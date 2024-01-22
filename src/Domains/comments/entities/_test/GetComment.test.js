const GetComment = require('../GetComment');

describe('GetComment', () => {
  it('should throw an error if the payload does not contain the required properties', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      username: 'danzbraham',
      date: '2024',
      content: 'Comment in a thread',
      is_deleted: false,
    };

    // Action & Assert
    expect(() => new GetComment(payload)).toThrow('GET_COMMENT.NOT_CONTAIN_REQUIRED_PROPERTY');
  });

  it('should throw an error if the payload does not meet the data type specification', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      username: 'danzbraham',
      date: 2024,
      content: 'Comment in a thread',
      is_deleted: false,
      replies: [],
    };

    // Action & Assert
    expect(() => new GetComment(payload)).toThrow('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create correct GetComment entity for a non-deleted comment', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      username: 'danzbraham',
      date: '2024',
      content: 'Comment in a thread',
      is_deleted: false,
      replies: [],
    };

    // Action
    const getComment = new GetComment(payload);

    // Assert
    expect(getComment).toBeInstanceOf(GetComment);
    expect(getComment.id).toEqual(payload.id);
    expect(getComment.username).toEqual(payload.username);
    expect(getComment.date).toEqual(payload.date);
    expect(getComment.content).toEqual(payload.content);
    expect(getComment.replies).toEqual(payload.replies);
  });

  it('should create correct GetComment entity for a deleted comment', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      username: 'danzbraham',
      date: '2024',
      content: '**comment has been deleted**',
      is_deleted: true,
      replies: [],
    };

    // Action
    const getComment = new GetComment(payload);

    // Assert
    expect(getComment).toBeInstanceOf(GetComment);
    expect(getComment.id).toEqual(payload.id);
    expect(getComment.username).toEqual(payload.username);
    expect(getComment.date).toEqual(payload.date);
    expect(getComment.content).toEqual(payload.content);
    expect(getComment.replies).toEqual(payload.replies);
  });
});
