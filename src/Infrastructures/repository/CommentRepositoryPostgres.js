const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddComment = require('../../Domains/comments/entities/AddComment');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const GetComment = require('../../Domains/comments/entities/GetComment');
const LikeComment = require('../../Domains/comments/entities/LikeComment');
const DeleteComment = require('../../Domains/comments/entities/DeleteComment');
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

  async checkAvailabilityComment(commentId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [commentId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment not found');
    }
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT c.id, u.username, c.date, c.content, c.is_deleted
              FROM comments AS c
              JOIN users AS u ON c.owner = u.id
              JOIN threads AS t ON c.thread_id = t.id
              WHERE t.id = $1`,
      values: [threadId],
    };
    const result = await this._pool.query(query);

    return result.rows.map((comment) => (new GetComment({ ...comment, replies: [] })));
  }

  async updateLikeComment(comment) {
    const { userId, commentId } = new LikeComment(comment);

    const queryCommentLikes = {
      text: `SELECT * FROM comment_likes
              WHERE comment_id = $1 AND user_id = $2`,
      values: [commentId, userId],
    };
    const { rowCount } = await this._pool.query(queryCommentLikes);

    if (!rowCount) {
      const id = `like-${this._idGenerator()}`;

      const queryInsertCommentLikes = {
        text: `INSERT INTO comment_likes
                VALUES ($1, $2, $3)`,
        values: [id, commentId, userId],
      };
      await this._pool.query(queryInsertCommentLikes);
    } else {
      const queryDeleteCommentLikes = {
        text: `DELETE FROM comment_likes
                WHERE comment_id = $1 AND user_id = $2`,
        values: [commentId, userId],
      };
      await this._pool.query(queryDeleteCommentLikes);
    }

    const queryCountCommentLikes = {
      text: `SELECT count(*)
              FROM comment_likes
              WHERE comment_id = $1`,
      values: [commentId],
    };
    const { rows } = await this._pool.query(queryCountCommentLikes);
    const { count } = rows[0];

    const queryUpdateLikeComment = {
      text: `UPDATE comments
              SET likes = $1
              WHERE id = $2`,
      values: [count, commentId],
    };
    await this._pool.query(queryUpdateLikeComment);
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
