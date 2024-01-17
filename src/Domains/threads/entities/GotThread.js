class GotThread {
  constructor(returnedValue) {
    this._verifyReturnedValue(returnedValue);

    const {
      id, title, body, date, username, comments,
    } = returnedValue;

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
    this.comments = comments;
  }

  _verifyReturnedValue({
    id, title, body, date, username, comments,
  }) {
    if (!id || !title || !body || !date || !username || !comments) {
      throw new Error('GOT_THREAD.NOT_CONTAIN_REQUIRED_PROPERTY');
    }

    if (typeof id !== 'string'
        || typeof title !== 'string'
        || typeof body !== 'string'
        || typeof date !== 'string'
        || typeof username !== 'string'
        || !Array.isArray(comments)
        || !comments.every((comment) => typeof comment === 'object')
    ) {
      throw new Error('GOT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GotThread;
