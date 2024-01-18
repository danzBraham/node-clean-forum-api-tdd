const GotThread = require('../../Domains/threads/entities/GotThread');

class GetThreadByIdUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(threadId) {
    await this._threadRepository.checkAvailabilityThread(threadId);
    const gotThread = await this._threadRepository.getThreadById(threadId);
    return new GotThread(gotThread);
  }
}

module.exports = GetThreadByIdUseCase;
