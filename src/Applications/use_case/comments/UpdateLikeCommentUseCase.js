const LikeComment = require('../../../Domains/comments/entities/LikeComment');

class UpdateLikeCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(userId, threadId, commentId) {
    const likeComment = new LikeComment({ userId, threadId, commentId });
    await this._threadRepository.checkAvailabilityThread(likeComment.threadId);
    await this._commentRepository.checkAvailabilityComment(likeComment.commentId);
    await this._commentRepository.updateLikeComment(likeComment);
  }
}

module.exports = UpdateLikeCommentUseCase;
