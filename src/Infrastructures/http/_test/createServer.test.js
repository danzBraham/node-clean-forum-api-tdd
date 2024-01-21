const createServer = require('../createServer');

describe('HTTP Server', () => {
  it('should response 404 when request unregistered route', async () => {
    // Arrange
    const server = await createServer({});

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/unregisteredRoute',
    });

    // Assert
    expect(response.statusCode).toEqual(404);
  });

  it('should handle server errors correctly', async () => {
    const requestPayload = {
      username: 'danzbraham',
      password: 'secret',
      fullname: 'Zidan Abraham',
    };

    const server = await createServer({});

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload,
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(500);
    expect(responseJson.status).toEqual('error');
    expect(responseJson.message).toEqual('there was a failure on our server');
  });
});
