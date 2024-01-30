const GetThread = require('../../../Domains/threads/entities/GetThread');
const GetComment = require('../../../Domains/comments/entities/GetComment');
const GetReply = require('../../../Domains/replies/entities/GetReply');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    await this._threadRepository.checkAvailabilityThread(threadId);

    const [thread, comments] = await Promise.all([
      await this._threadRepository.getThreadById(threadId),
      await this._commentRepository.getCommentsByThreadId(threadId),
    ]);

    const getComments = await Promise.all(comments.map(async (comment) => {
      const replies = await this._replyRepository.getRepliesByCommentId(comment.id);
      const getReplies = replies.map((reply) => {
        const {
          id, username, date, content,
        } = new GetReply(reply);
        return {
          id, username, date, content,
        };
      });

      const {
        id, username, date, content, likes: likeCount,
      } = new GetComment(comment);
      return {
        id, username, date, content, likeCount, replies: getReplies,
      };
    }));

    return new GetThread({ ...thread, comments: getComments });
  }
}

module.exports = GetThreadUseCase;
