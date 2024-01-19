const DeleteReply = require('../../Domains/replies/entities/DeleteReply');

class DeleteReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(userId, threadId, commentId, replyId) {
    const deleteReply = new DeleteReply({ userId, commentId, replyId });
    await this._threadRepository.checkAvailabilityThread(threadId);
    await this._commentRepository.checkAvailabilityComment(deleteReply.commentId);
    await this._replyRepository.checkAvailabilityReply(deleteReply.replyId);
    await this._replyRepository.deleteReply(deleteReply);
  }
}

module.exports = DeleteReplyUseCase;
