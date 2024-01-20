const AddComment = require('../../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(userId, threadId, useCasePayload) {
    await this._threadRepository.checkAvailabilityThread(threadId);
    const comment = new AddComment({ userId, threadId, ...useCasePayload });
    return this._commentRepository.addComment(comment);
  }
}

module.exports = AddCommentUseCase;
