const DomainErrorTranslator = require('../DomainErrorTranslator');
const InvariantError = require('../InvariantError');

describe('DomainErrorTranslator', () => {
  it('should translate error correctly', () => {
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.NOT_CONTAIN_REQUIRED_PROPERTY')))
      .toStrictEqual(new InvariantError('cannot create a user because the required properties are missing'));
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('cannot create a user because the data type does not meet data type specification'));
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.USERNAME_LIMIT_CHAR')))
      .toStrictEqual(new InvariantError('cannot create a user because the username character exceeds the limit'));
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER')))
      .toStrictEqual(new InvariantError('cannot create a user because the username contains a restricted character'));
    expect(DomainErrorTranslator.translate(new Error('USER_LOGIN.NOT_CONTAIN_REQUIRED_PROPERTY')))
      .toStrictEqual(new InvariantError('must provide a username and password'));
    expect(DomainErrorTranslator.translate(new Error('USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('username and password must be strings'));
    expect(DomainErrorTranslator.translate(new Error('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')))
      .toStrictEqual(new InvariantError('must provide a refresh token'));
    expect(DomainErrorTranslator.translate(new Error('REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('refresh token must be a string'));
    expect(DomainErrorTranslator.translate(new Error('LOGOUT_USER_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')))
      .toStrictEqual(new InvariantError('must provide a refresh token'));
    expect(DomainErrorTranslator.translate(new Error('LOGOUT_USER_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('refresh token must be a string'));
    expect(DomainErrorTranslator.translate(new Error('ADD_THREAD.NOT_CONTAIN_REQUIRED_PROPERTY')))
      .toStrictEqual(new InvariantError('cannot create a thread because the required properties are missing'));
    expect(DomainErrorTranslator.translate(new Error('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('cannot create a thread because the data type does not meet data type specification'));
    expect(DomainErrorTranslator.translate(new Error('ADD_COMMENT.NOT_CONTAIN_REQUIRED_PROPERTY')))
      .toStrictEqual(new InvariantError('cannot create a comment because the required properties are missing'));
    expect(DomainErrorTranslator.translate(new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('cannot create a comment because the data type does not meet data type specification'));
    expect(DomainErrorTranslator.translate(new Error('ADD_REPLY.NOT_CONTAIN_REQUIRED_PROPERTY')))
      .toStrictEqual(new InvariantError('cannot create a reply because the required properties are missing'));
    expect(DomainErrorTranslator.translate(new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('cannot create a reply because the data type does not meet data type specification'));
  });

  it('should return the original error when the error message is not needed to translate', () => {
    // Arrange
    const error = new Error('some-error-message');

    // Action
    const translatedError = DomainErrorTranslator.translate(error);

    // Assert
    expect(translatedError).toStrictEqual(error);
  });
});
