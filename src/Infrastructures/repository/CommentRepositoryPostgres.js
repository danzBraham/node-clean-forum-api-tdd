const AddComment = require('../../Domains/comments/entities/AddComment');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const DeleteComment = require('../../Domains/comments/entities/DeleteComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AuthorizationError = require('../../Commons/AuthorizationError');

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

  async deleteComment(comment) {
    const { userId: owner, threadId, commentId } = new DeleteComment(comment);

    const query = {
      text: `UPDATE comments SET is_deleted = true
              WHERE owner = $1 AND thread_id = $2 AND id = $3`,
      values: [owner, threadId, commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('you cannot delete this comment');
    }
  }
}

module.exports = CommentRepositoryPostgres;
