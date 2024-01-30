const DomainErrorTranslator = require('../DomainErrorTranslator');
const InvariantError = require('../InvariantError');

describe('DomainErrorTranslator', () => {
  it('should translate error correctly', () => {
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.NOT_CONTAIN_REQUIRED_PROPERTY')))
      .toStrictEqual(new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'));
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai spesifikasi'));
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.USERNAME_LIMIT_CHAR')))
      .toStrictEqual(new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas'));
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER')))
      .toStrictEqual(new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'));

    expect(DomainErrorTranslator.translate(new Error('USER_LOGIN.NOT_CONTAIN_REQUIRED_PROPERTY')))
      .toStrictEqual(new InvariantError('harus menyediakan username dan password'));
    expect(DomainErrorTranslator.translate(new Error('USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('username and password harus berupa string'));

    expect(DomainErrorTranslator.translate(new Error('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')))
      .toStrictEqual(new InvariantError('harus menyediakan refresh token'));
    expect(DomainErrorTranslator.translate(new Error('REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('refresh token harus berupa string'));

    expect(DomainErrorTranslator.translate(new Error('LOGOUT_USER_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')))
      .toStrictEqual(new InvariantError('harus menyediakan refresh token'));
    expect(DomainErrorTranslator.translate(new Error('LOGOUT_USER_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('refresh token harus berupa string'));

    expect(DomainErrorTranslator.translate(new Error('ADD_THREAD.NOT_CONTAIN_REQUIRED_PROPERTY')))
      .toStrictEqual(new InvariantError('tidak dapat membuat thread karena properti yang dibutuhkan tidak ada'));
    expect(DomainErrorTranslator.translate(new Error('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('tidak dapat membuat thread karena tipe data tidak sesuai spesifikasi'));

    expect(DomainErrorTranslator.translate(new Error('ADD_COMMENT.NOT_CONTAIN_REQUIRED_PROPERTY')))
      .toStrictEqual(new InvariantError('tidak dapat membuat komentar karena properti yang dibutuhkan tidak ada'));
    expect(DomainErrorTranslator.translate(new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('tidak dapat membuat komentar karena tipe data tidak sesuai spesifikasi'));

    expect(DomainErrorTranslator.translate(new Error('ADD_REPLY.NOT_CONTAIN_REQUIRED_PROPERTY')))
      .toStrictEqual(new InvariantError('tidak dapat membuat balasan karena properti yang dibutuhkan tidak ada'));
    expect(DomainErrorTranslator.translate(new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('tidak dapat membuat balasan karena tipe data tidak sesuai spesifikasi'));
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
