const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const UserLogoutUseCase = require('../UserLogoutUseCase');

describe('UserLogoutUseCase', () => {
  it('should throw an error if the use case payload does not contain a refresh token', async () => {
    // Arrange
    const useCasePayload = {};
    const userLogoutUseCase = new UserLogoutUseCase({});

    // Action & Assert
    await expect(userLogoutUseCase.execute(useCasePayload))
      .rejects
      .toThrow('USER_LOGOUT_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
  });

  it('should throw an error if the refresh token is not a string', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: [true],
    };
    const userLogoutUseCase = new UserLogoutUseCase({});

    // Action & Assert
    await expect(userLogoutUseCase.execute(useCasePayload))
      .rejects
      .toThrow('USER_LOGOUT_USE_CASE.PAYLOAD_MOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the delete authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refresh-token',
    };
    const mockAuthenticationRepository = new AuthenticationRepository();

    // mocking required function
    mockAuthenticationRepository.checkAvailabilityToken = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationRepository.deleteToken = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // create use case instance
    const userLogoutUseCase = new UserLogoutUseCase({
      authenticationRepository: mockAuthenticationRepository,
    });

    // Action
    await userLogoutUseCase.execute(useCasePayload);

    // Assert
    expect(mockAuthenticationRepository.checkAvailabilityToken)
      .toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationRepository.deleteToken)
      .toHaveBeenCalledWith(useCasePayload.refreshToken);
  });
});
