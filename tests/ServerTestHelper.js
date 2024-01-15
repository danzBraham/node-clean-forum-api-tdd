// istanbul ignore file
const jwt = require('@hapi/jwt');
const UsersTableTestHelper = require('./UsersTableTestHelper');

const ServerTestHelper = {
  async getAccessToken() {
    const payload = {
      id: 'user-123',
      username: 'danzbraham',
    };

    await UsersTableTestHelper.addUser({
      ...payload,
      password: 'secret',
      fullname: 'Zidan Abraham',
    });

    return jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY);
  },
};

module.exports = ServerTestHelper;
