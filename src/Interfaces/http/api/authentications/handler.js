const UserLoginUseCase = require('../../../../Applications/use_case/UserLoginUseCase');

class AuthenticationsHandler {
  constructor(container) {
    this._container = container;
    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
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
}

module.exports = AuthenticationsHandler;
