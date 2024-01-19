class DeleteReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { userId, replyId, commentId } = payload;
    this.userId = userId;
    this.commentId = commentId;
    this.replyId = replyId;
  }

  _verifyPayload({ userId, commentId, replyId }) {
    if (!userId || !commentId || !replyId) {
      throw new Error('DELETE_REPLY.NOT_CONTAIN_REQUIRED_PROPERTY');
    }

    if (typeof userId !== 'string' || typeof commentId !== 'string' || typeof replyId !== 'string') {
      throw new Error('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteReply;
