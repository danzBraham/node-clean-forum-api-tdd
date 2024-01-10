const Hapi = require('@hapi/hapi');
const users = require('../../Interfaces/http/api/users');
const ClientError = require('../../Commons/ClientError');
const DomainErrorTranslator = require('../../Commons/DomainErrorTranslator');

const createServer = async (container) => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
  });

  await server.register([
    {
      plugin: users,
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
