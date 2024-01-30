const GetThread = require('../../../../Domains/threads/entities/GetThread');
const GetComment = require('../../../../Domains/comments/entities/GetComment');
const GetReply = require('../../../../Domains/replies/entities/GetReply');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const expectedGetThread = new GetThread({
      id: 'thread-123',
      title: 'My Thread',
      body: 'a thread',
      date: '2024',
      username: 'danzbraham',
      comments: [
        {
          id: 'comment-123',
          username: 'danzbraham',
          date: '2024',
          content: 'a comment',
          likeCount: 7,
          replies: [
            {
              id: 'reply-123',
              username: 'danzbraham',
              date: '2024',
              content: 'a reply',
            },
          ],
        },
      ],
    });

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    // mocking required function
    mockThreadRepository.checkAvailabilityThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockReplyRepository.getRepliesByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve([
        new GetReply({
          id: 'reply-123',
          username: 'danzbraham',
          date: '2024',
          content: 'a reply',
          is_deleted: false,
        }),
      ]));

    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([
        new GetComment({
          id: 'comment-123',
          username: 'danzbraham',
          date: '2024',
          content: 'a comment',
          is_deleted: false,
          likes: 7,
          replies: [],
        }),
      ]));

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(
        new GetThread({
          id: 'thread-123',
          title: 'My Thread',
          body: 'a thread',
          date: '2024',
          username: 'danzbraham',
          comments: [],
        }),
      ));

    // creating use case instance
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const thread = await getThreadUseCase.execute('thread-123');

    // Assert
    expect(thread).toStrictEqual(expectedGetThread);
    expect(mockThreadRepository.checkAvailabilityThread).toHaveBeenCalledWith('thread-123');
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith('thread-123');
    expect(mockReplyRepository.getRepliesByCommentId).toHaveBeenCalledWith('comment-123');
  });
});
