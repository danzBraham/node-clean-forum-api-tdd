const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const pool = require('../../database/postgres/pool');
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
    it('should response 201 and persist the reply', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      const requestPayload = {
        content: 'Hello this is my comment in Thread',
      };

      await UsersTableTestHelper.addUser({ id: userId, username: 'danzbraham' });
      const accessToken = await ServerTestHelper.getAccessToken({ id: userId, username: 'danzbraham' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });

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

    it('should response 400 when the request payload not contain required property', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      const requestPayload = {};

      await UsersTableTestHelper.addUser({ id: userId, username: 'danzbraham' });
      const accessToken = await ServerTestHelper.getAccessToken({ id: userId, username: 'danzbraham' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });

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
      expect(responseJson.message).toEqual('tidak dapat membuat balasan karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when the request payload not meet data type specification', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      const requestPayload = {
        content: 123,
      };

      await UsersTableTestHelper.addUser({ id: userId, username: 'danzbraham' });
      const accessToken = await ServerTestHelper.getAccessToken({ id: userId, username: 'danzbraham' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });

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
      expect(responseJson.message).toEqual('tidak dapat membuat balasan karena tipe data tidak sesuai spesifikasi');
    });

    it('should response 404 when the comment does not exist', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      const requestPayload = {
        content: 'Hello this is my comment in Thread',
      };

      await UsersTableTestHelper.addUser({ id: userId, username: 'danzbraham' });
      const accessToken = await ServerTestHelper.getAccessToken({ id: userId, username: 'danzbraham' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

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
      expect(responseJson.message).toEqual('komentar tidak ditemukan');
    });

    it('should response 404 when the thread does not exist', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      const requestPayload = {
        content: 'Hello this is my comment in Thread',
      };

      await UsersTableTestHelper.addUser({ id: userId, username: 'danzbraham' });
      const accessToken = await ServerTestHelper.getAccessToken({ id: userId, username: 'danzbraham' });

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
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 and delete the reply correctly', async () => {
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

    it("should response 403 when attempting to delete someone else's reply", async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });
      await RepliesTableTestHelper.addReply({ id: replyId, commentId, owner: userId });

      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'abra' });
      const accessToken = await ServerTestHelper.getAccessToken({ id: 'user-456', username: 'abra' });

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
      expect(responseJson.message).toEqual('anda tidak bisa menghapus balasan ini');
    });

    it('should response 404 when the reply does not exist', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser({ id: userId, username: 'danzbraham' });
      const accessToken = await ServerTestHelper.getAccessToken({ id: userId, username: 'danzbraham' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });

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
      expect(responseJson.message).toEqual('balasan tidak ditemukan');
    });

    it('should response 404 when the comment does not exist', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser({ id: userId, username: 'danzbraham' });
      const accessToken = await ServerTestHelper.getAccessToken({ id: userId, username: 'danzbraham' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

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
      expect(responseJson.message).toEqual('komentar tidak ditemukan');
    });

    it('should response 404 when the thread does not exist', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser({ id: userId, username: 'danzbraham' });
      const accessToken = await ServerTestHelper.getAccessToken({ id: userId, username: 'danzbraham' });

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
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });
  });
});
