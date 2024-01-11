const UserLogin = require('../../../Domains/users/entities/UserLogin');
const NewAuth = require('../../../Domains/authentications/entities/NewAuth');
const UserRepository = require('../../../Domains/users/UserRepository');
const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const PasswordHasher = require('../../security/PasswordHasher');
const UserLoginUseCase = require('../UserLoginUseCase');

describe('UserLoginUseCase', () => {
  it('should orchestrating the get authentication action correctly', async () => {
    // Arrange
    const useCasePayload = new UserLogin({
      username: 'danzbraham',
      password: 'secret',
    });
    const mockAuthentication = new NewAuth({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
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
      .mockImplementation(() => Promise.resolve(mockAuthentication.accessToken));
    mockAuthenticationTokenManager.createRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAuthentication.refreshToken));
    mockAuthenticationRepository.addToken = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // create use case instance
    const userLoginUseCase = new UserLoginUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      passwordHasher: mockPasswordHasher,
    });

    // Action
    const actualAuthentication = await userLoginUseCase.execute(useCasePayload);

    // Assert
    expect(actualAuthentication).toStrictEqual(new NewAuth({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    }));
    expect(mockUserRepository.getPasswordByUsername)
      .toHaveBeenCalledWith(useCasePayload.username);
    expect(mockPasswordHasher.compare)
      .toHaveBeenCalledWith(useCasePayload.password, 'encrypted-password');
    expect(mockUserRepository.getIdByUsername)
      .toHaveBeenCalledWith(useCasePayload.username);
    expect(mockAuthenticationTokenManager.createAccessToken)
      .toHaveBeenCalledWith({ id: 'user-123', username: 'danzbraham' });
    expect(mockAuthenticationTokenManager.createRefreshToken)
      .toHaveBeenCalledWith({ id: 'user-123', username: 'danzbraham' });
    expect(mockAuthenticationRepository.addToken)
      .toHaveBeenCalledWith(mockAuthentication.refreshToken);
  });
});
