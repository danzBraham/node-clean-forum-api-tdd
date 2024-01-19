const AuthorizationError = require('../../Commons/AuthorizationError');
const NotFoundError = require('../../Commons/NotFoundError');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddReply = require('../../Domains/replies/entities/AddReply');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const DeleteReply = require('../../Domains/replies/entities/DeleteReply');

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
      throw new NotFoundError('reply not found');
    }
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
      throw new AuthorizationError('you cannot delete this reply');
    }
  }
}

module.exports = ReplyRepositoryPostgres;
