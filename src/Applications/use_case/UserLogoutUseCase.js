class UserLogoutUseCase {
  constructor({ authenticationRepository }) {
    this._authenticationRepository = authenticationRepository;
  }

  async execute(useCasePayload) {
    this._verifyUseCasePayload(useCasePayload);
    const { refreshToken } = useCasePayload;

    await this._authenticationRepository.checkAvailabilityToken(refreshToken);
    await this._authenticationRepository.deleteToken(refreshToken);
  }

  _verifyUseCasePayload({ refreshToken }) {
    if (!refreshToken) {
      throw new Error('USER_LOGOUT_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
    }

    if (typeof refreshToken !== 'string') {
      throw new Error('USER_LOGOUT_USE_CASE.PAYLOAD_MOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = UserLogoutUseCase;
