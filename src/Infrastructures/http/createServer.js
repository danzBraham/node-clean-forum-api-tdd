const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const users = require('../../Interfaces/http/api/users');
const authentications = require('../../Interfaces/http/api/authentications');
const threads = require('../../Interfaces/http/api/threads');
const comments = require('../../Interfaces/http/api/comments');
const ClientError = require('../../Commons/ClientError');
const DomainErrorTranslator = require('../../Commons/DomainErrorTranslator');

const createServer = async (container) => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
  });

  // external plugin registration
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // define jwt authentication strategy
  server.auth.strategy('forum-api-jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
        username: artifacts.decoded.payload.username,
      },
    }),
  });

  await server.register([
    {
      plugin: users,
      options: { container },
    },
    {
      plugin: authentications,
      options: { container },
    },
    {
      plugin: threads,
      options: { container },
    },
    {
      plugin: comments,
      options: { container },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    // get the response context of the request
    const { response } = request;

    if (response instanceof Error) {
      // if the response is an error, handle it as needed
      const translatedError = DomainErrorTranslator.translate(response);

      // handling client errors internally
      if (translatedError instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: translatedError.message,
        });
        newResponse.code(translatedError.statusCode);
        return newResponse;
      }

      // retains the client error handling by hapi natively, such as 404, etc
      if (!translatedError.isServer) {
        return h.continue;
      }

      // server error handling as needed
      const newResponse = h.response({
        status: 'error',
        message: 'there was a failure on our server',
      });
      newResponse.code(500);
      return newResponse;
    }

    // if not an error, continue with the previous response (without intervening)
    return h.continue;
  });

  return server;
};

module.exports = createServer;
