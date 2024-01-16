const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: handler.postCommentByThreadIdHandler,
    options: {
      auth: 'forum-api-jwt',
    },
  },
]);

module.exports = routes;
