const AuthenticationTokenManager = require('../../Applications/security/AuthenticationTokenManager');
const InvariantError = require('../../Commons/InvariantError');

class JwtTokenManager extends AuthenticationTokenManager {
  constructor(jwt) {
    super();
    this._jwt = jwt;
  }

  async createAccessToken(payload) {
    return this._jwt.generate(payload, process.env.ACCESS_TOKEN_KEY);
  }

  async createRefreshToken(payload) {
    return this._jwt.generate(payload, process.env.REFRESH_TOKEN_KEY);
  }

  async verifyRefreshToken(token) {
    try {
      const artifacts = await this._jwt.decode(token);
      await this._jwt.verify(artifacts, process.env.REFRESH_TOKEN_KEY);
    } catch (error) {
      throw new InvariantError('Invalid refresh token');
    }
  }

  async decodePayload(token) {
    const artifacts = await this._jwt.decode(token);
    return artifacts.decoded.payload;
  }
}

module.exports = JwtTokenManager;
