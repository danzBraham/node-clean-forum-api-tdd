const NotFoundError = require('../../../Commons/NotFoundError');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const GotThread = require('../../../Domains/threads/entities/GotThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread', async () => {
      // Arrange
      const thread = new AddThread({
        userId: 'user-123',
        title: 'My Thread',
        body: 'Hello this is my Thread',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({ id: 'user-123' });

      // Action
      await threadRepositoryPostgres.addThread(thread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      const thread = new AddThread({
        userId: 'user-123',
        title: 'My Thread',
        body: 'Hello this is my Thread',
      });
      const expectedAddedThread = new AddedThread({
        id: 'thread-123',
        title: 'My Thread',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({ id: 'user-123' });

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(thread);

      // Assert
      expect(addedThread).toStrictEqual(expectedAddedThread);
    });
  });

  describe('checkAvailabilityThread function', () => {
    it('should throw a NotFoundError when a thread does not exist', async () => {
      // Arrange
      const threadId = 'invalid-thread-id';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.checkAvailabilityThread(threadId))
        .rejects
        .toThrow(NotFoundError);
    });

    it('should not throw a NotFoundError when a thread does exist', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.checkAvailabilityThread(threadId))
        .resolves
        .not.toThrow(NotFoundError);
    });
  });

  describe('getThreadById function', () => {
    it('should return get thread correctly', async () => {
      // Arrange
      const threadId = 'thread-123';
      const fixedDate = new Date().toISOString();

      const expectedGotThread = new GotThread({
        id: 'thread-123',
        title: 'My Thread',
        body: 'Hello this is my Thread',
        date: fixedDate,
        username: 'danzbraham',
        comments: [
          {
            id: 'comment-123',
            username: 'luffy',
            date: fixedDate,
            content: 'first',
          },
          {
            id: 'comment-456',
            username: 'zoro',
            date: fixedDate,
            content: '**comment has been deleted**',
          },
        ],
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'danzbraham' });
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'luffy' });
      await UsersTableTestHelper.addUser({ id: 'user-789', username: 'zoro' });

      await ThreadsTableTestHelper.addThread({
        id: threadId,
        title: 'My Thread',
        body: 'Hello this is my Thread',
        date: fixedDate,
        owner: 'user-123',
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId,
        date: fixedDate,
        content: 'first',
        owner: 'user-456',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-456',
        threadId,
        date: fixedDate,
        content: 'second',
        owner: 'user-789',
        isDeleted: true,
      });

      // Action
      const gotThread = await threadRepositoryPostgres.getThreadById(threadId);

      // Assert
      expect(gotThread).toStrictEqual(expectedGotThread);
    });
  });
});
