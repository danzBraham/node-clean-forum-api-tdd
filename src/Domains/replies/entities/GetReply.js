/* eslint-disable camelcase */
class GetReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, username, date, content, is_deleted,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = is_deleted ? GetReply.DELETE_REPLY_MESSAGE : content;
    this.is_deleted = is_deleted;
  }

  _verifyPayload({
    id, username, date, content, is_deleted,
  }) {
    if (!id || !username || !date || !content || is_deleted === undefined) {
      throw new Error('GET_REPLY.NOT_CONTAIN_REQUIRED_PROPERTY');
    }

    if (typeof id !== 'string'
        || typeof username !== 'string'
        || typeof date !== 'string'
        || typeof content !== 'string'
        || typeof is_deleted !== 'boolean'
    ) {
      throw new Error('GET_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

GetReply.DELETE_REPLY_MESSAGE = '**reply has been deleted**';

module.exports = GetReply;
