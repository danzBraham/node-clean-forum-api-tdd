const GotThread = require('../../Domains/threads/entities/GotThread');

class GetThreadByIdUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(threadId) {
    this._verifyThreadId(threadId);
    await this._threadRepository.checkAvailabilityThread(threadId);
    const gotThread = await this._threadRepository.getThreadById(threadId);
    return new GotThread(gotThread);
  }

  _verifyThreadId(threadId) {
    if (!threadId || typeof threadId !== 'string') {
      throw new Error('GET_THREAD_BY_ID_USE_CASE.INVALID_THREAD_ID');
    }
  }
}

module.exports = GetThreadByIdUseCase;
