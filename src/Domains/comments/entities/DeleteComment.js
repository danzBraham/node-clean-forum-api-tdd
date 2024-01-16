class DeleteComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { userId, threadId } = payload;
    this.userId = userId;
    this.threadId = threadId;
  }

  _verifyPayload({ userId, threadId }) {
    if (!userId || !threadId) {
      throw new Error('DELETE_COMMENT.NOT_CONTAIN_REQUIRED_PROPERTY');
    }

    if (typeof userId !== 'string' || typeof threadId !== 'string') {
      throw new Error('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteComment;
