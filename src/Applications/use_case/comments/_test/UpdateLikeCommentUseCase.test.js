const LikeComment = require('../../../../Domains/comments/entities/LikeComment');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const UpdateLikeCommentUseCase = require('../UpdateLikeCommentUseCase');

describe('UpdateLikeCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    const expectedLikeComment = new LikeComment({
      userId,
      threadId,
      commentId,
    });

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // mocking required function
    mockThreadRepository.checkAvailabilityThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkAvailabilityComment = jest.fn(() => Promise.resolve());
    mockCommentRepository.updateLikeComment = jest.fn(() => Promise.resolve());

    // creating use case instance
    const updateLikeCommentUseCase = new UpdateLikeCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await updateLikeCommentUseCase.execute(userId, threadId, commentId);

    // Assert
    expect(mockThreadRepository.checkAvailabilityThread).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.checkAvailabilityComment).toHaveBeenCalledWith(commentId);
    expect(mockCommentRepository.updateLikeComment).toHaveBeenCalledWith(expectedLikeComment);
  });
});
