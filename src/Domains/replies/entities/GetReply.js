class GetReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, username, date, content, is_deleted: isDeleted,
    } = payload;
    this.id = id;
    this.username = username;
    this.date = date;
    this.content = isDeleted ? GetReply.DELETE_REPLY_MESSAGE : content;
  }

  _verifyPayload({
    id, username, date, content, is_deleted: isDeleted,
  }) {
    if (!id || !username || !date || !content || isDeleted === undefined) {
      throw new Error('GET_REPLY.NOT_CONTAIN_REQUIRED_PROPERTY');
    }

    if (typeof id !== 'string'
        || typeof username !== 'string'
        || typeof date !== 'string'
        || typeof content !== 'string'
        || typeof isDeleted !== 'boolean'
    ) {
      throw new Error('GET_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

GetReply.DELETE_REPLY_MESSAGE = '**reply has been deleted**';

module.exports = GetReply;
