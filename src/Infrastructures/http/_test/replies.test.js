const pool = require('../../database/postgres/pool');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/replies endpoint', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and persist reply', async () => {
      // Arrange
      const requestPayload = {
        content: 'Hello this is my comment in Thread',
      };

      const userPayload = {
        id: 'user-123',
        username: 'danzbraham',
      };

      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser(userPayload);
      const accessToken = await ServerTestHelper.getAccessToken(userPayload);
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userPayload.id });
      await CommentsTableTestHelper.addComment({ id: commentId, owner: userPayload.id });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
      expect(responseJson.data.addedReply.content).toEqual(requestPayload.content);
    });

    it('should response 400 if request payload not contain required property', async () => {
      // Arrange
      const requestPayload = {};

      const userPayload = {
        id: 'user-123',
        username: 'danzbraham',
      };

      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser(userPayload);
      const accessToken = await ServerTestHelper.getAccessToken(userPayload);
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userPayload.id });
      await CommentsTableTestHelper.addComment({ id: commentId, owner: userPayload.id });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('cannot create a reply because the required properties are missing');
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
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser(userPayload);
      const accessToken = await ServerTestHelper.getAccessToken(userPayload);
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userPayload.id });
      await CommentsTableTestHelper.addComment({ id: commentId, owner: userPayload.id });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('cannot create a reply because the data type does not meet data type specification');
    });

    it('should response 404 if thread does not exist', async () => {
      // Arrange
      const requestPayload = {
        content: 'Reply to a comment',
      };

      const userPayload = {
        id: 'user-123',
        username: 'danzbraham',
      };

      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser(userPayload);
      const accessToken = await ServerTestHelper.getAccessToken(userPayload);

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread not found');
    });

    it('should response 404 if comment does not exist', async () => {
      // Arrange
      const requestPayload = {
        content: 'Reply to a comment',
      };

      const userPayload = {
        id: 'user-123',
        username: 'danzbraham',
      };

      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser(userPayload);
      const accessToken = await ServerTestHelper.getAccessToken(userPayload);
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userPayload.id });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment not found');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 and delete reply', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser({ id: userId });
      const accessToken = await ServerTestHelper.getAccessToken({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });
      await RepliesTableTestHelper.addReply({ id: replyId, commentId, owner: userId });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it("should response 403 if trying to delete someone else's reply", async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser({ id: userId, username: 'danzbraham' });
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'abra' });

      const accessToken = await ServerTestHelper.getAccessToken({ id: userId });

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });
      await RepliesTableTestHelper.addReply({ id: replyId, commentId, owner: 'user-456' });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('you cannot delete this reply');
    });

    it('should response 404 if thread does not exist', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser({ id: userId, username: 'danzbraham' });
      const accessToken = await ServerTestHelper.getAccessToken({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: 'thread-456', owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId: 'thread-456', owner: userId });
      await RepliesTableTestHelper.addReply({ id: replyId, commentId, owner: userId });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
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

    it('should response 404 if comment does not exist', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser({ id: userId, username: 'danzbraham' });
      const accessToken = await ServerTestHelper.getAccessToken({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: 'comment-456', threadId, owner: userId });
      await RepliesTableTestHelper.addReply({ id: replyId, commentId: 'comment-456', owner: userId });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
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

    it('should response 404 if reply does not exist', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser({ id: userId, username: 'danzbraham' });
      const accessToken = await ServerTestHelper.getAccessToken({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });
      await RepliesTableTestHelper.addReply({ id: 'reply-456', commentId, owner: userId });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('reply not found');
    });
  });
});
