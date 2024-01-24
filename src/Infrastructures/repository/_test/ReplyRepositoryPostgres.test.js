const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const GetReply = require('../../../Domains/replies/entities/GetReply');
const DeleteReply = require('../../../Domains/replies/entities/DeleteReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

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
    it('should persist a new reply in the database correctly', async () => {
      // Arrange
      const threadId = 'thread-123';

      const reply = new AddReply({
        userId: 'user-123',
        commentId: 'comment-123',
        content: 'Reply to a a comment',
      });

      await UsersTableTestHelper.addUser({ id: reply.userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: reply.userId });
      await CommentsTableTestHelper.addComment({
        id: reply.commentId,
        threadId,
        owner: reply.userId,
      });

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
        content: reply.content,
        owner: reply.userId,
      });

      await UsersTableTestHelper.addUser({ id: reply.userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: reply.userId });
      await CommentsTableTestHelper.addComment({
        id: reply.commentId,
        threadId,
        owner: reply.userId,
      });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(reply);

      // Assert
      expect(addedReply).toStrictEqual(expectedAddedReply);
    });
  });

  describe('checkAvailabilityReply function', () => {
    it('should throw a NotFoundError if the reply does not exist', async () => {
      // Arrange
      const replyId = 'reply-123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.checkAvailabilityReply(replyId))
        .rejects
        .toThrow(NotFoundError);
    });

    it('should not throw a NotFoundError if the reply does exist', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });
      await RepliesTableTestHelper.addReply({ id: replyId, commentId, owner: userId });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.checkAvailabilityReply(replyId))
        .resolves
        .not.toThrow(NotFoundError);
    });
  });

  describe('getRepliesByCommentId function', () => {
    it('should return replies correctly', async () => {
      // Arrange
      const commentId = 'comment-123';
      const fixedDate = new Date().toISOString();

      const expectedGetReplies = [
        new GetReply({
          id: 'reply-123',
          username: 'danzbraham',
          date: fixedDate,
          content: 'a reply',
          is_deleted: false,
        }),
        new GetReply({
          id: 'reply-456',
          username: 'abra',
          date: fixedDate,
          content: 'a reply',
          is_deleted: false,
        }),
      ];

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'danzbraham' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId: 'thread-123', owner: 'user-123' });
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        commentId,
        content: 'a reply',
        date: fixedDate,
        owner: 'user-123',
        isDeleted: false,
      });

      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'abra' });
      await RepliesTableTestHelper.addReply({
        id: 'reply-456',
        commentId,
        content: 'a reply',
        date: fixedDate,
        owner: 'user-456',
        isDeleted: false,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const getReplies = await replyRepositoryPostgres.getRepliesByCommentId('comment-123');

      // Assert
      expect(getReplies).toStrictEqual(expectedGetReplies);
    });
  });

  describe('deleteReply function', () => {
    it('should delete the reply in the database correctly', async () => {
      // Arrange
      const threadId = 'thread-123';

      const deleteReply = new DeleteReply({
        userId: 'user-123',
        commentId: 'comment-123',
        replyId: 'reply-123',
      });

      await UsersTableTestHelper.addUser({ id: deleteReply.userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: deleteReply.userId });
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

    it("should throw an AuthorizationError if attempting to delete someone else's reply", async () => {
      // Arrange
      const threadId = 'thread-123';

      const deleteReply = new DeleteReply({
        userId: 'user-123',
        commentId: 'comment-123',
        replyId: 'reply-123',
      });

      await UsersTableTestHelper.addUser({ id: 'user-456' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: 'user-456' });
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
