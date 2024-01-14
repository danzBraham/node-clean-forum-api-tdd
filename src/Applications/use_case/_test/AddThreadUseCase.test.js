const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const useCasePayload = {
      title: 'My Thread',
      body: 'Hello this is my Thread',
    };

    // create dependency of use case
    const mockThreadRepository = new ThreadRepository();

    // mocking required function
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(new AddedThread({
        id: 'thread-123',
        title: 'My Thread',
        owner: 'user-123',
      })));

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(userId, useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(new AddedThread({
      id: 'thread-123',
      title: 'My Thread',
      owner: 'user-123',
    }));
    expect(mockThreadRepository.addThread)
      .toHaveBeenCalledWith(new AddThread({
        userId: 'user-123',
        title: 'My Thread',
        body: 'Hello this is my Thread',
      }));
  });
});
