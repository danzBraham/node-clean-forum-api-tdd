const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
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
});
