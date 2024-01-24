const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddReply = require('../../Domains/replies/entities/AddReply');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const GetReply = require('../../Domains/replies/entities/GetReply');
const DeleteReply = require('../../Domains/replies/entities/DeleteReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(reply) {
    const { userId: owner, commentId, content } = new AddReply(reply);
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO replies VALUES ($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, commentId, content, date, owner],
    };
    const result = await this._pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async checkAvailabilityReply(replyId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1',
      values: [replyId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('balasan tidak ditemukan');
    }
  }

  async getRepliesByCommentId(commentId) {
    const query = {
      text: `SELECT r.id, u.username, r.date, r.content, r.is_deleted
              FROM replies AS r
              JOIN users AS u ON u.id = r.owner
              JOIN comments AS c ON c.id = r.comment_id
              WHERE c.id = $1`,
      values: [commentId],
    };
    const result = await this._pool.query(query);

    return result.rows.map((reply) => new GetReply(reply));
  }

  async deleteReply(reply) {
    const { userId: owner, commentId, replyId } = new DeleteReply(reply);

    const query = {
      text: `UPDATE replies SET is_deleted = true
              WHERE owner = $1 AND comment_id = $2 AND id = $3`,
      values: [owner, commentId, replyId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('anda tidak bisa menghapus balasan ini');
    }
  }
}

module.exports = ReplyRepositoryPostgres;
