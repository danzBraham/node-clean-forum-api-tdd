const UserLogin = require('../../../../Domains/users/entities/LoginUser');
const NewAuth = require('../../../../Domains/authentications/entities/NewAuth');
const UserRepository = require('../../../../Domains/users/UserRepository');
const AuthenticationRepository = require('../../../../Domains/authentications/AuthenticationRepository');
const AuthenticationTokenManager = require('../../../security/AuthenticationTokenManager');
const PasswordHasher = require('../../../security/PasswordHasher');
const LoginUserUseCase = require('../LoginUserUseCase');

describe('LoginUserUseCase', () => {
  it('should orchestrating the get authentication action correctly', async () => {
    // Arrange
    const useCasePayload = new UserLogin({
      username: 'danzbraham',
      password: 'secret',
    });

    const tokenPayload = {
      id: 'user-123',
      username: 'danzbraham',
    };

    const expectedNewAuth = new NewAuth({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });

    // creating dependency of use case
    const mockUserRepository = new UserRepository();
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    const mockPasswordHasher = new PasswordHasher();

    // mocking required function
    mockUserRepository.getPasswordByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve('encrypted-password'));
    mockPasswordHasher.compare = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockUserRepository.getIdByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve('user-123'));
    mockAuthenticationTokenManager.createAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve('access-token'));
    mockAuthenticationTokenManager.createRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve('refresh-token'));
    mockAuthenticationRepository.addToken = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // creating use case instance
    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      passwordHasher: mockPasswordHasher,
    });

    // Action
    const actualAuthentication = await loginUserUseCase.execute(useCasePayload);

    // Assert
    expect(actualAuthentication).toStrictEqual(expectedNewAuth);
    expect(mockUserRepository.getPasswordByUsername)
      .toHaveBeenCalledWith(useCasePayload.username);
    expect(mockPasswordHasher.compare)
      .toHaveBeenCalledWith(useCasePayload.password, 'encrypted-password');
    expect(mockUserRepository.getIdByUsername)
      .toHaveBeenCalledWith(useCasePayload.username);
    expect(mockAuthenticationTokenManager.createAccessToken)
      .toHaveBeenCalledWith(tokenPayload);
    expect(mockAuthenticationTokenManager.createRefreshToken)
      .toHaveBeenCalledWith(tokenPayload);
    expect(mockAuthenticationRepository.addToken)
      .toHaveBeenCalledWith(expectedNewAuth.refreshToken);
  });
});
