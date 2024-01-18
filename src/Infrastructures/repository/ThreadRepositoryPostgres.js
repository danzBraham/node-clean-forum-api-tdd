const NotFoundError = require('../../Commons/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddThread = require('../../Domains/threads/entities/AddThread');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const GotThread = require('../../Domains/threads/entities/GotThread');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(thread) {
    const { userId: owner, title, body } = new AddThread(thread);
    const id = `thread-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads VALUES ($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, date, owner],
    };
    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async checkAvailabilityThread(threadId) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread not found');
    }
  }

  async getThreadById(threadId) {
    const queryThreadById = {
      text: `SELECT t.id, t.title, t.body, t.date, u.username
              FROM threads AS t
              JOIN users AS u ON t.owner = u.id
              WHERE t.id = $1`,
      values: [threadId],
    };
    const resultThreadById = await this._pool.query(queryThreadById);

    const queryCommentsByThreadId = {
      text: `SELECT c.id, u.username ,c.date, c.content, c.is_deleted
              FROM comments AS c
              JOIN users AS u ON c.owner = u.id
              JOIN threads AS t ON c.thread_id = t.id
              WHERE t.id = $1`,
      values: [threadId],
    };
    const resultCommentsByThreadId = await this._pool.query(queryCommentsByThreadId);

    const mappedResultCommentsByThreadId = resultCommentsByThreadId.rows
      .map(({
        id, username, date, content, is_deleted: isDeleted,
      }) => ({
        id,
        username,
        date,
        content: isDeleted ? '**comment has been deleted**' : content,
      }));

    return new GotThread({ ...resultThreadById.rows[0], comments: mappedResultCommentsByThreadId });
  }
}

module.exports = ThreadRepositoryPostgres;
