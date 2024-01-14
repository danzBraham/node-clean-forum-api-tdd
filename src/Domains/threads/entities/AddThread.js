class AddThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { userId, title, body } = payload;
    this.userId = userId;
    this.title = title;
    this.body = body;
  }

  _verifyPayload({ userId, title, body }) {
    if (!userId || !title || !body) {
      throw new Error('ADD_THREAD.NOT_CONTAIN_REQUIRED_PROPERTY');
    }

    if (typeof userId !== 'string' || typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddThread;
