const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/users endpoint', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /users', () => {
    it('should response 201 and persist user', async () => {
      // Arrange
      const requestPayload = {
        username: 'danzbraham',
        password: 'secret',
        fullname: 'Zidan Abraham',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedUser).toBeDefined();
    });

    it('should response 400 when request payload not contain required property', async () => {
      // Arrange
      const requestPayload = {
        username: 'danzbraham',
        password: 'secret',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('cannot create a user because the required properties are missing');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        username: 'danzbraham',
        password: true,
        fullname: ['Zidan', 'Abraham'],
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('cannot create a user because the data type does not meet data type specification');
    });

    it('should response 400 when the username has more than 50 characters', async () => {
      // Arrange
      const requestPayload = {
        username: 'danzbrahamdanzbrahamdanzbrahamdanzbrahamdanzbrahamdanzbraham',
        password: 'secret',
        fullname: 'Zidan Abraham',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('cannot create a user because the username character exceeds the limit');
    });

    it('should response 400 when the username contains a restricted character', async () => {
      // Arrange
      const requestPayload = {
        username: 'danz braham',
        password: 'secret',
        fullname: 'Zidan Abraham',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('cannot create a user because the username contains a restricted character');
    });

    it('should response 400 when the username not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'danzbraham' });
      const requestPayload = {
        username: 'danzbraham',
        password: 'secret',
        fullname: 'Zidan Abraham',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('username not available');
    });
  });
});
