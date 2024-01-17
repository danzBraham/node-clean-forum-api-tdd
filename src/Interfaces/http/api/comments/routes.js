const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: handler.postCommentByThreadIdHandler,
    options: {
      auth: 'forum-api-jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: handler.deleteCommentByThreadIdAndCommentIdHandler,
    options: {
      auth: 'forum-api-jwt',
    },
  },
]);

module.exports = routes;
