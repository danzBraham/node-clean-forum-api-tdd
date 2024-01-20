const AddThread = require('../../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(userId, useCasePayload) {
    const thread = new AddThread({ userId, ...useCasePayload });
    return this._threadRepository.addThread(thread);
  }
}

module.exports = AddThreadUseCase;
