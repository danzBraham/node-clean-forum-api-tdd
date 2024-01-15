const AddComment = require('../../Domains/comments/entities/AddComment');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(comment) {
    const { userId: owner, threadId, content } = new AddComment(comment);
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments VALUES ($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, threadId, content, date, owner],
    };
    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }
}

module.exports = CommentRepositoryPostgres;
