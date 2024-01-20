const AuthenticationRepository = require('../../../../Domains/authentications/AuthenticationRepository');
const LogoutUserUseCase = require('../LogoutUserUseCase');

describe('LogoutUserUseCase', () => {
  it('should throw an error if the use case payload does not contain a refresh token', async () => {
    // Arrange
    const useCasePayload = {};
    const logoutUserUseCase = new LogoutUserUseCase({});

    // Action & Assert
    await expect(logoutUserUseCase.execute(useCasePayload))
      .rejects
      .toThrow('LOGOUT_USER_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
  });

  it('should throw an error if the refresh token is not a string', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: [true],
    };
    const logoutUserUseCase = new LogoutUserUseCase({});

    // Action & Assert
    await expect(logoutUserUseCase.execute(useCasePayload))
      .rejects
      .toThrow('LOGOUT_USER_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the delete authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refresh-token',
    };

    // creating dependency of use case
    const mockAuthenticationRepository = new AuthenticationRepository();

    // mocking required function
    mockAuthenticationRepository.checkAvailabilityToken = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationRepository.deleteToken = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // creating use case instance
    const logoutUserUseCase = new LogoutUserUseCase({
      authenticationRepository: mockAuthenticationRepository,
    });

    // Action
    await logoutUserUseCase.execute(useCasePayload);

    // Assert
    expect(mockAuthenticationRepository.checkAvailabilityToken)
      .toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationRepository.deleteToken)
      .toHaveBeenCalledWith(useCasePayload.refreshToken);
  });
});
