const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');

describe('/authentications endpoint', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /authentications', () => {
    it('should response 201 and grant authentication', async () => {
      // Arrange
      const requestPaylaod = {
        username: 'danzbraham',
        password: 'secret',
      };

      const server = await createServer(container);

      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'danzbraham',
          password: 'secret',
          fullname: 'Zidan Abraham',
        },
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPaylaod,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.accessToken).toBeDefined();
      expect(responseJson.data.refreshToken).toBeDefined();
    });

    it('should response 400 when the username not found', async () => {
      // Arrange
      const requestPaylaod = {
        username: 'danzbraham',
        password: 'secret',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPaylaod,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('username tidak valid');
    });

    it('should response 401 when the password is incorrect', async () => {
      // Arrange
      const requestPaylaod = {
        username: 'danzbraham',
        password: 'wrong-password',
      };

      const server = await createServer(container);

      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'danzbraham',
          password: 'secret',
          fullname: 'Zidan Abraham',
        },
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPaylaod,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('password tidak valid');
    });

    it('should response 400 when the request payload does not contain the required property', async () => {
      // Arrange
      const requestPaylaod = {
        username: 'danzbraham',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPaylaod,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('harus menyediakan username dan password');
    });

    it('should response 400 when the request payload contain wrong data type', async () => {
      // Arrange
      const requestPaylaod = {
        username: 'danzbraham',
        password: ['secret'],
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPaylaod,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('username and password harus berupa string');
    });
  });

  describe('when PUT /authentications', () => {
    it('should response 200 and grant a new access token', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'danzbraham' });
      const refreshToken = await ServerTestHelper.getRefreshToken({ id: 'user-123', username: 'danzbraham' });
      await AuthenticationsTableTestHelper.addToken(refreshToken);

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: { refreshToken },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.accessToken).toBeDefined();
    });

    it('should response 400 when the request payload does not contain a refresh token', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {},
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('harus menyediakan refresh token');
    });

    it('should response 400 when the refresh token is not a string', async () => {
      // Arrange
      const refreshToken = [true];
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: { refreshToken },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token harus berupa string');
    });

    it('should response 400 when the refresh token is invalid', async () => {
      // Arrange
      const refreshToken = 'invalid-refresh-token';
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: { refreshToken },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token tidak valid');
    });

    it('should response 400 when the refresh token is not registered in the database', async () => {
      // Arrange
      const refreshToken = await ServerTestHelper.getRefreshToken({ id: 'user-123', username: 'danzbraham' });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: { refreshToken },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token tidak ditemukan di database');
    });
  });

  describe('when DELETE /authentications', () => {
    it('should response 200 when the user logs out successfully', async () => {
      // Arrange
      const refreshToken = 'refresh-token';
      await AuthenticationsTableTestHelper.addToken(refreshToken);
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: { refreshToken },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 400 when the request payload does not contain a refresh token', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {},
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('harus menyediakan refresh token');
    });

    it('should response 400 when the refresh token is not a string', async () => {
      // Arrange
      const refreshToken = [true];
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: { refreshToken },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token harus berupa string');
    });

    it('should response 400 when the refresh token is not registered in the database', async () => {
      // Arrange
      const refreshToken = await ServerTestHelper.getRefreshToken({ id: 'user-123', username: 'danzbraham' });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: { refreshToken },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token tidak ditemukan di database');
    });
  });
});
