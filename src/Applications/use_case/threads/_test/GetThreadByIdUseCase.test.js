const GetThread = require('../../../../Domains/threads/entities/GetThread');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const GetThreadByIdUseCase = require('../GetThreadByIdUseCase');

describe('GetThreadByIdUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';

    const expectedGetThread = new GetThread({
      id: threadId,
      title: 'My Thread',
      body: 'Hello this is my Thread',
      date: '2024-01-17T05:57:56.392Z',
      username: 'danzbraham',
      comments: [{
        id: 'comment-123',
        username: 'abra',
        date: '2024-01-20T03:53:19.329Z',
        content: 'a comment',
      }],
    });

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();

    // mocking required function
    mockThreadRepository.checkAvailabilityThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(new GetThread({
        id: 'thread-123',
        title: 'My Thread',
        body: 'Hello this is my Thread',
        date: '2024-01-17T05:57:56.392Z',
        username: 'danzbraham',
        comments: [{
          id: 'comment-123',
          username: 'abra',
          date: '2024-01-20T03:53:19.329Z',
          content: 'a comment',
        }],
      })));

    // creating use case instance
    const getThreadByIdUseCase = new GetThreadByIdUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const getThread = await getThreadByIdUseCase.execute(threadId);

    // Assert
    expect(getThread).toStrictEqual(expectedGetThread);
    expect(mockThreadRepository.checkAvailabilityThread).toHaveBeenCalledWith(threadId);
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
  });
});
