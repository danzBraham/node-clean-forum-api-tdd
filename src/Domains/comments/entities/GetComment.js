/* eslint-disable camelcase */
class GetComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, username, date, content, is_deleted, replies,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = is_deleted ? GetComment.DELETE_COMMENT_MESSAGE : content;
    this.is_deleted = is_deleted;
    this.replies = replies;
  }

  _verifyPayload({
    id, username, date, content, is_deleted, replies,
  }) {
    if (!id || !username || !date || !content || is_deleted === undefined || !replies) {
      throw new Error('GET_COMMENT.NOT_CONTAIN_REQUIRED_PROPERTY');
    }

    if (typeof id !== 'string'
        || typeof username !== 'string'
        || typeof date !== 'string'
        || typeof content !== 'string'
        || typeof is_deleted !== 'boolean'
        || !Array.isArray(replies)
    ) {
      throw new Error('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

GetComment.DELETE_COMMENT_MESSAGE = '**comment has been deleted**';

module.exports = GetComment;
