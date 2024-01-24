const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const GetComment = require('../../../Domains/comments/entities/GetComment');
const DeleteComment = require('../../../Domains/comments/entities/DeleteComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

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
    it('should persist a new comment in the database correctly', async () => {
      // Arrange
      const comment = new AddComment({
        userId: 'user-123',
        threadId: 'thread-123',
        content: 'Hello this is my comment in Thread',
      });

      await UsersTableTestHelper.addUser({ id: comment.userId });
      await ThreadsTableTestHelper.addThread({ id: comment.threadId, owner: comment.userId });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

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
        content: comment.content,
        owner: comment.userId,
      });

      await UsersTableTestHelper.addUser({ id: comment.userId });
      await ThreadsTableTestHelper.addThread({ id: comment.threadId, owner: comment.userId });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(comment);

      // Assert
      expect(addedComment).toStrictEqual(expectedAddedComment);
    });
  });

  describe('checkAvailabilityComment function', () => {
    it('should throw a NotFoundError if the comment does not exist', async () => {
      // Arrange
      const commentId = 'comment-123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.checkAvailabilityComment(commentId))
        .rejects
        .toThrow(NotFoundError);
    });

    it('should not throw a NotFoundError if the comment does exist', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.checkAvailabilityComment(commentId))
        .resolves
        .not.toThrow(NotFoundError);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return comments correctly', async () => {
      // Arrange
      const threadId = 'thread-123';
      const fixedDate = new Date().toISOString();

      const expectedGetComments = [
        new GetComment({
          id: 'comment-123',
          username: 'danzbraham',
          date: fixedDate,
          content: 'a comment',
          is_deleted: false,
          replies: [],
        }),
        new GetComment({
          id: 'comment-456',
          username: 'abra',
          date: fixedDate,
          content: 'a comment',
          is_deleted: false,
          replies: [],
        }),
      ];

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'danzbraham' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId,
        date: fixedDate,
        content: 'a comment',
        owner: 'user-123',
        isDeleted: false,
      });

      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'abra' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-456',
        threadId,
        date: fixedDate,
        content: 'a comment',
        owner: 'user-456',
        isDeleted: false,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const getComments = await commentRepositoryPostgres.getCommentsByThreadId(threadId);

      // Assert
      expect(getComments).toStrictEqual(expectedGetComments);
    });
  });

  describe('deleteComment function', () => {
    it('should delete a comment in the database correctly', async () => {
      // Arrange
      const comment = new DeleteComment({
        userId: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      });

      await UsersTableTestHelper.addUser({ id: comment.userId });
      await ThreadsTableTestHelper.addThread({ id: comment.threadId, owner: comment.userId });
      await CommentsTableTestHelper.addComment({
        id: comment.commentId,
        threadId: comment.threadId,
        owner: comment.userId,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteComment(comment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments[0].is_deleted).toEqual(true);
    });

    it("should throw an AuthorizationError if attempting to delete someone else's comment", async () => {
      // Arrange
      const comment = new DeleteComment({
        userId: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      });

      await UsersTableTestHelper.addUser({ id: 'user-456' });
      await ThreadsTableTestHelper.addThread({ id: comment.threadId, owner: 'user-456' });
      await CommentsTableTestHelper.addComment({
        id: comment.commentId,
        threadId: comment.threadId,
        owner: 'user-456',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.deleteComment(comment))
        .rejects
        .toThrow(AuthorizationError);
    });
  });
});
