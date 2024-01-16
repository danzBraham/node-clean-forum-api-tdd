const DeleteComment = require('../../Domains/comments/entities/DeleteComment');

class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(userId, threadId) {
    const deleteComment = new DeleteComment({ userId, threadId });
    await this._threadRepository.checkAvailabilityThread(deleteComment.threadId);
    await this._commentRepository.verifyOwner(deleteComment.userId);
  }
}

module.exports = DeleteCommentUseCase;
