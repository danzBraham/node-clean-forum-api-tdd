const CommentRepository = require('../CommentRepository');

describe('CommentRepository interface', () => {
  it('should throw an error when invoking abstract behavior', async () => {
    // Arrange
    const commentRepository = new CommentRepository();

    // Action and Assert
    await expect(commentRepository.addComment({})).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
