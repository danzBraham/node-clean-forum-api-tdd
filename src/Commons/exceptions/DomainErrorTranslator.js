const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_REQUIRED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai spesifikasi'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),

  'USER_LOGIN.NOT_CONTAIN_REQUIRED_PROPERTY': new InvariantError('harus menyediakan username dan password'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username and password harus berupa string'),

  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus menyediakan refresh token'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus berupa string'),

  'LOGOUT_USER_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus menyediakan refresh token'),
  'LOGOUT_USER_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus berupa string'),

  'ADD_THREAD.NOT_CONTAIN_REQUIRED_PROPERTY': new InvariantError('tidak dapat membuat thread karena properti yang dibutuhkan tidak ada'),
  'ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat thread karena tipe data tidak sesuai spesifikasi'),

  'ADD_COMMENT.NOT_CONTAIN_REQUIRED_PROPERTY': new InvariantError('tidak dapat membuat komentar karena properti yang dibutuhkan tidak ada'),
  'ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat komentar karena tipe data tidak sesuai spesifikasi'),

  'ADD_REPLY.NOT_CONTAIN_REQUIRED_PROPERTY': new InvariantError('tidak dapat membuat balasan karena properti yang dibutuhkan tidak ada'),
  'ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat balasan karena tipe data tidak sesuai spesifikasi'),
};

module.exports = DomainErrorTranslator;
