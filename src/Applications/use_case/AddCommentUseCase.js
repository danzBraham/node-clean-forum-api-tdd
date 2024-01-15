const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(userId, threadId, useCasePayload) {
    const comment = new AddComment({ userId, threadId, ...useCasePayload });
    return this._commentRepository.addComment(comment);
  }
}

module.exports = AddCommentUseCase;
