const NotFoundError = require('../../../Commons/NotFoundError');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const GetThread = require('../../../Domains/threads/entities/GetThread');
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
    it('should persist a new thread in the database correctly', async () => {
      // Arrange
      const thread = new AddThread({
        userId: 'user-123',
        title: 'My Thread',
        body: 'Hello this is my Thread',
      });

      await UsersTableTestHelper.addUser({ id: 'user-123' });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

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
        title: thread.title,
        owner: thread.userId,
      });

      await UsersTableTestHelper.addUser({ id: 'user-123' });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(thread);

      // Assert
      expect(addedThread).toStrictEqual(expectedAddedThread);
    });
  });

  describe('checkAvailabilityThread function', () => {
    it('should throw a NotFoundError if the thread does not exist', async () => {
      // Arrange
      const threadId = 'thread-123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.checkAvailabilityThread(threadId))
        .rejects
        .toThrow(NotFoundError);
    });

    it('should not throw a NotFoundError if the thread does exist', async () => {
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
    it('should return a thread correctly', async () => {
      // Arrange
      const threadId = 'thread-123';
      const fixedDate = new Date().toISOString();

      const expectedGetThread = new GetThread({
        id: threadId,
        title: 'My Thread',
        body: 'a thread',
        date: fixedDate,
        username: 'danzbraham',
        comments: [],
      });

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'danzbraham' });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        title: 'My Thread',
        body: 'a thread',
        date: fixedDate,
        owner: 'user-123',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const getThread = await threadRepositoryPostgres.getThreadById(threadId);

      // Assert
      expect(getThread).toStrictEqual(expectedGetThread);
    });
  });
});
