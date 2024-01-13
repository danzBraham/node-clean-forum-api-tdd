const UserLoginUseCase = require('../../../../Applications/use_case/UserLoginUseCase');
const RefreshAuthenticationUseCase = require('../../../../Applications/use_case/RefreshAuthenticationUseCase');
const UserLogoutUseCase = require('../../../../Applications/use_case/UserLogoutUseCase');

class AuthenticationsHandler {
  constructor(container) {
    this._container = container;
    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    const userLoginUseCase = this._container.getInstance(UserLoginUseCase.name);
    const { accessToken, refreshToken } = await userLoginUseCase.execute(request.payload);

    const response = h.response({
      status: 'success',
      data: { accessToken, refreshToken },
    });
    response.code(201);
    return response;
  }

  async putAuthenticationHandler(request, h) {
    const refreshAuthenticationUseCase = this._container
      .getInstance(RefreshAuthenticationUseCase.name);
    const accessToken = await refreshAuthenticationUseCase.execute(request.payload);

    const response = h.response({
      status: 'success',
      data: { accessToken },
    });
    response.code(200);
    return response;
  }

  async deleteAuthenticationHandler(request, h) {
    const userLogoutUseCase = this._container.getInstance(UserLogoutUseCase.name);
    await userLogoutUseCase.execute(request.payload);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = AuthenticationsHandler;
