const GetThread = require('../../../Domains/threads/entities/GetThread');

class GetThreadByIdUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(threadId) {
    await this._threadRepository.checkAvailabilityThread(threadId);
    const getThread = await this._threadRepository.getThreadById(threadId);
    return new GetThread(getThread);
  }
}

module.exports = GetThreadByIdUseCase;
