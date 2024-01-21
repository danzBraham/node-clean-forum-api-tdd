// istanbul ignore file
const Jwt = require('@hapi/jwt');

const ServerTestHelper = {
  async getAccessToken({ id = 'user-123', username = 'danzbraham' }) {
    return Jwt.token.generate({ id, username }, process.env.ACCESS_TOKEN_KEY);
  },

  async getRefreshToken({ id = 'user-123', username = 'danzbraham' }) {
    return Jwt.token.generate({ id, username }, process.env.REFRESH_TOKEN_KEY);
  },
};

module.exports = ServerTestHelper;
