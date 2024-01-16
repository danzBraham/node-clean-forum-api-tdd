const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const DeleteComment = require('../../../Domains/comments/entities/DeleteComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AuthorizationError = require('../../../Commons/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment', async () => {
      // Arrange
      const comment = new AddComment({
        userId: 'user-123',
        threadId: 'thread-123',
        content: 'Hello this is my comment in Thread',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser(comment.userId);
      await ThreadsTableTestHelper.addThread(comment.threadId);

      // Action
      await commentRepositoryPostgres.addComment(comment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const comment = new AddComment({
        userId: 'user-123',
        threadId: 'thread-123',
        content: 'Hello this is my comment in Thread',
      });
      const expectedAddedComment = new AddedComment({
        id: 'comment-123',
        content: 'Hello this is my comment in Thread',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser(comment.userId);
      await ThreadsTableTestHelper.addThread(comment.threadId);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(comment);

      // Assert
      expect(addedComment).toStrictEqual(expectedAddedComment);
    });
  });

  describe('deleteComment function', () => {
    it('should throw AuthorizationError if not delete own comment', async () => {
      // Arrange
      const comment = new DeleteComment({
        userId: 'user-456',
        threadId: 'thread-123',
        commentId: 'comment-123',
      });
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread(comment.threadId);
      await CommentsTableTestHelper.addComment({ id: comment.commentId, owner: 'user-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.deleteComment(comment))
        .rejects
        .toThrow(AuthorizationError);
    });

    it('should delete a comment from the database correctly', async () => {
      // Arrange
      const comment = new DeleteComment({
        userId: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      });
      await UsersTableTestHelper.addUser(comment.userId);
      await ThreadsTableTestHelper.addThread(comment.threadId);
      await CommentsTableTestHelper.addComment(comment.commentId);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteComment(comment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments[0].is_deleted).toEqual(true);
    });
  });
});
