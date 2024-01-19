const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const DeleteReply = require('../../../Domains/replies/entities/DeleteReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const NotFoundError = require('../../../Commons/NotFoundError');
const AuthorizationError = require('../../../Commons/AuthorizationError');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist add reply', async () => {
      // Arrange
      const threadId = 'thread-123';

      const reply = new AddReply({
        userId: 'user-123',
        commentId: 'comment-123',
        content: 'Reply to a a comment',
      });

      await UsersTableTestHelper.addUser({ id: reply.userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: reply.userId });
      await CommentsTableTestHelper.addComment({ id: reply.commentId, owner: reply.userId });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await replyRepositoryPostgres.addReply(reply);

      // Assert
      const replies = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(replies).toHaveLength(1);
    });

    it('should return added reply correctly', async () => {
      // Arrange
      const threadId = 'thread-123';

      const reply = new AddReply({
        userId: 'user-123',
        commentId: 'comment-123',
        content: 'Reply to a a comment',
      });

      const expectedAddedReply = new AddedReply({
        id: 'reply-123',
        content: 'Reply to a a comment',
        owner: 'user-123',
      });

      await UsersTableTestHelper.addUser({ id: reply.userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: reply.userId });
      await CommentsTableTestHelper.addComment({ id: reply.commentId, owner: reply.userId });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(reply);

      // Assert
      expect(addedReply).toStrictEqual(expectedAddedReply);
    });
  });

  describe('checkAvailabilityReply function', () => {
    it('should throw a NotFoundError if the reply is not found', async () => {
      // Arrange
      const replyId = 'reply-123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.checkAvailabilityReply(replyId))
        .rejects
        .toThrow(NotFoundError);
    });

    it('should not throw a NotFoundError if the reply is found', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, owner: userId });
      await RepliesTableTestHelper.addReply({ id: replyId, owner: userId });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.checkAvailabilityReply(replyId))
        .resolves
        .not.toThrow(NotFoundError);
    });
  });

  describe('deleteReply function', () => {
    it('should delete a reply in the database correctly', async () => {
      // Arrange
      const threadId = 'thread-123';

      const deleteReply = new DeleteReply({
        userId: 'user-123',
        commentId: 'comment-123',
        replyId: 'reply-123',
      });

      await UsersTableTestHelper.addUser({
        id: deleteReply.userId,
      });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: deleteReply.userId,
      });
      await CommentsTableTestHelper.addComment({
        id: deleteReply.commentId,
        threadId,
        owner: deleteReply.userId,
      });
      await RepliesTableTestHelper.addReply({
        id: deleteReply.replyId,
        commentId: deleteReply.commentId,
        owner: deleteReply.userId,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      await replyRepositoryPostgres.deleteReply(deleteReply);

      // Assert
      const replies = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(replies[0].is_deleted).toEqual(true);
    });

    it("should throw an AuthorizationError if trying to delete someone else's reply", async () => {
      // Arrange
      const threadId = 'thread-123';

      const deleteReply = new DeleteReply({
        userId: 'user-123',
        commentId: 'comment-123',
        replyId: 'reply-123',
      });

      await UsersTableTestHelper.addUser({
        id: 'user-456',
      });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: 'user-456',
      });
      await CommentsTableTestHelper.addComment({
        id: deleteReply.commentId,
        threadId,
        owner: 'user-456',
      });
      await RepliesTableTestHelper.addReply({
        id: deleteReply.replyId,
        commentId: deleteReply.commentId,
        owner: 'user-456',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.deleteReply(deleteReply))
        .rejects
        .toThrow(AuthorizationError);
    });
  });
});
