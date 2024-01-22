class GetComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, username, date, content, is_deleted: isDeleted, replies,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = isDeleted ? GetComment.DELETE_COMMENT_MESSAGE : content;
    this.replies = replies;
  }

  _verifyPayload({
    id, username, date, content, is_deleted: isDeleted, replies,
  }) {
    if (!id || !username || !date || !content || isDeleted === undefined || !replies) {
      throw new Error('GET_COMMENT.NOT_CONTAIN_REQUIRED_PROPERTY');
    }

    if (typeof id !== 'string'
        || typeof username !== 'string'
        || typeof date !== 'string'
        || typeof content !== 'string'
        || typeof isDeleted !== 'boolean'
        || !Array.isArray(replies)
    ) {
      throw new Error('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

GetComment.DELETE_COMMENT_MESSAGE = '**comment has been deleted**';

module.exports = GetComment;
