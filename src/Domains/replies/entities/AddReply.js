class AddReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { userId, commentId, content } = payload;
    this.userId = userId;
    this.commentId = commentId;
    this.content = content;
  }

  _verifyPayload({ userId, commentId, content }) {
    if (!userId || !commentId || !content) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_REQUIRED_PROPERTY');
    }

    if (typeof userId !== 'string' || typeof commentId !== 'string' || typeof content !== 'string') {
      throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddReply;
