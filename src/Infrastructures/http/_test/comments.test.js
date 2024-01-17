const pool = require('../../database/postgres/pool');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/comments endpoint', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persist comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'Hello this is my comment in Thread',
      };
      const userPayload = {
        id: 'user-123',
        username: 'danzbraham',
      };
      const threadId = 'thread-123';

      await UsersTableTestHelper.addUser(userPayload);
      const accessToken = await ServerTestHelper.getAccessToken(userPayload);
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userPayload.id });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.content).toEqual(requestPayload.content);
    });

    it('should response 400 if request payload not contain required property', async () => {
      // Arrange
      const requestPayload = {};
      const userPayload = {
        id: 'user-123',
        username: 'danzbraham',
      };
      const threadId = 'thread-123';

      await UsersTableTestHelper.addUser(userPayload);
      const accessToken = await ServerTestHelper.getAccessToken(userPayload);
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userPayload.id });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('cannot create a new comment because the required properties are missing');
    });

    it('should response 400 if request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        content: 123,
      };
      const userPayload = {
        id: 'user-123',
        username: 'danzbraham',
      };
      const threadId = 'thread-123';

      await UsersTableTestHelper.addUser(userPayload);
      const accessToken = await ServerTestHelper.getAccessToken(userPayload);
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userPayload.id });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('cannot create a new comment because the data type does not meet data type specification');
    });

    it('should response 404 if thread does not exist', async () => {
      // Arrange
      const userPayload = {
        id: 'user-123',
        username: 'danzbraham',
      };
      const invalidThreadId = 'invalid-thread-id';

      await UsersTableTestHelper.addUser(userPayload);
      const accessToken = await ServerTestHelper.getAccessToken(userPayload);
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: userPayload.id });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${invalidThreadId}/comments`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread not found');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and delete comment correctly', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const userPayload = {
        id: userId,
        username: 'danzbraham',
      };

      await UsersTableTestHelper.addUser(userPayload);
      const accessToken = await ServerTestHelper.getAccessToken(userPayload);
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 403 if trying to delete someone else\'s comment', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const userPayload = {
        id: userId,
        username: 'danzbraham',
      };

      await UsersTableTestHelper.addUser({ id: 'user-456' });
      await UsersTableTestHelper.addUser(userPayload);

      const accessToken = await ServerTestHelper.getAccessToken(userPayload);

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: 'user-456' });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('you cannot delete this comment');
    });

    it('should response 404 if comment does not exist', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const userPayload = {
        id: userId,
        username: 'danzbraham',
      };

      await UsersTableTestHelper.addUser(userPayload);
      const accessToken = await ServerTestHelper.getAccessToken(userPayload);
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment not found');
    });

    it('should response 404 if thread does not exist', async () => {
      // Arrange
      const userPayload = {
        id: 'user-123',
        username: 'danzbraham',
      };
      const invalidThreadId = 'invalid-thread-id';
      await UsersTableTestHelper.addUser(userPayload);
      const accessToken = await ServerTestHelper.getAccessToken(userPayload);
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: userPayload.id });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${invalidThreadId}/comments`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread not found');
    });
  });
});
