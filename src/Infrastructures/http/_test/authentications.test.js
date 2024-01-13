const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const AuthenticationTokenManager = require('../../../Applications/security/AuthenticationTokenManager');
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

    it('should response 400 if username not found', async () => {
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
      expect(responseJson.message).toEqual('invalid username');
    });

    it('should response 401 if the password is wrong', async () => {
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
      expect(responseJson.message).toEqual('Invalid password');
    });

    it('should response 400 if login payload does not contain the required property', async () => {
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
      expect(responseJson.message).toEqual('must provide a username and password');
    });

    it('should response 400 if login payload contain wrong data type', async () => {
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
      expect(responseJson.message).toEqual('username and password must be strings');
    });
  });

  describe('when PUT /authentications', () => {
    it('should response 200 and grant a new access token', async () => {
      // Arrange
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

      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'danzbraham',
          password: 'secret',
        },
      });
      const { data: { refreshToken } } = JSON.parse(loginResponse.payload);

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

    it('should response 400 if the request payload does not contain a refresh token', async () => {
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
      expect(responseJson.message).toEqual('must provide a refresh token');
    });

    it('should response 400 if the refresh token is not a string', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: { refreshToken: [true] },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token must be a string');
    });

    it('should response 400 if the refresh token is not valid', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: { refreshToken: 'invalid-refresh-token' },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token is invalid');
    });

    it('should response 400 if the refresh token is not registered in the database', async () => {
      // Arrange
      const server = await createServer(container);
      const refreshToken = await container
        .getInstance(AuthenticationTokenManager.name)
        .createRefreshToken({ id: 'user-123', username: 'danzbraham' });

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
      expect(responseJson.message).toEqual('refresh token not found in the database');
    });
  });

  describe('when DELETE /authentications', () => {
    it('should response 200 if the user logs out successfully', async () => {
      // Arrange
      const server = await createServer(container);
      const refreshToken = 'refresh-token';
      await AuthenticationsTableTestHelper.addToken(refreshToken);

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

    it('should response 400 if the request payload does not contain a refresh token', async () => {
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
      expect(responseJson.message).toEqual('must provide a refresh token');
    });

    it('should response 400 if the refresh token is not a string', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: { refreshToken: [true] },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token must be a string');
    });

    it('should response 400 if the refresh token is not registered in the database', async () => {
      // Arrange
      const server = await createServer(container);
      const refreshToken = await container
        .getInstance(AuthenticationTokenManager.name)
        .createRefreshToken({ id: 'user-123', username: 'danzbraham' });

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
      expect(responseJson.message).toEqual('refresh token not found in the database');
    });
  });
});
