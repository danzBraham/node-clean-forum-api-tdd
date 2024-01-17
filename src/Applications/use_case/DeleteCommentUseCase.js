const DeleteComment = require('../../Domains/comments/entities/DeleteComment');

class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(userId, threadId, commentId) {
    const deleteComment = new DeleteComment({ userId, threadId, commentId });
    await this._threadRepository.checkAvailabilityThread(deleteComment.threadId);
    await this._commentRepository.checkAvailabilityComment(deleteComment.commentId);
    await this._commentRepository.deleteComment(deleteComment);
  }
}

module.exports = DeleteCommentUseCase;
