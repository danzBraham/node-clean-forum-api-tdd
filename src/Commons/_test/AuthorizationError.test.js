const ClientError = require('../ClientError');
const AuthorizationError = require('../AuthorizationError');

describe('AuthorizationError', () => {
  it('should create an error correctly', () => {
    const authorizationError = new AuthorizationError('authorization error!');

    expect(authorizationError).toBeInstanceOf(AuthorizationError);
    expect(authorizationError).toBeInstanceOf(ClientError);
    expect(authorizationError).toBeInstanceOf(Error);

    expect(authorizationError.statusCode).toEqual(403);
    expect(authorizationError.message).toEqual('authorization error!');
    expect(authorizationError.name).toEqual('AuthorizationError');
  });
});
