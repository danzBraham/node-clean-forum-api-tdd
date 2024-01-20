const LoginUser = require('../../../Domains/users/entities/LoginUser');
const NewAuth = require('../../../Domains/authentications/entities/NewAuth');

class LoginUserUseCase {
  constructor({
    userRepository, authenticationRepository, authenticationTokenManager, passwordHasher,
  }) {
    this._userRepository = userRepository;
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
    this._passwordHasher = passwordHasher;
  }

  async execute(useCasePayload) {
    const { username, password } = new LoginUser(useCasePayload);

    const encryptedPassword = await this._userRepository.getPasswordByUsername(username);
    await this._passwordHasher.compare(password, encryptedPassword);

    const id = await this._userRepository.getIdByUsername(username);
    const payload = { id, username };

    const accessToken = await this._authenticationTokenManager.createAccessToken(payload);
    const refreshToken = await this._authenticationTokenManager.createRefreshToken(payload);

    const newAuth = new NewAuth({ accessToken, refreshToken });
    await this._authenticationRepository.addToken(newAuth.refreshToken);

    return newAuth;
  }
}

module.exports = LoginUserUseCase;
