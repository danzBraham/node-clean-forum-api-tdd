class AddComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { userId, threadId, content } = payload;
    this.userId = userId;
    this.threadId = threadId;
    this.content = content;
  }

  _verifyPayload({ userId, threadId, content }) {
    if (!userId || !threadId || !content) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_REQUIRED_PROPERTY');
    }

    if (typeof userId !== 'string' || typeof threadId !== 'string' || typeof content !== 'string') {
      throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddComment;
