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

    it('should response 400 when request payload not contain required property', async () => {
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

    it('should response 400 when request payload not meet data type specification', async () => {
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
  });
});
