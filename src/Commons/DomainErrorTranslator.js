const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_REQUIRED_PROPERTY': new InvariantError('cannot create a new user because the required properties are missing'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('cannot create a new user because the data type does not meet data type specification'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('cannot create a new user because the username character exceeds the limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('cannot create a new user because the username contains a restricted character'),
  'USER_LOGIN.NOT_CONTAIN_REQUIRED_PROPERTY': new InvariantError('must provide a username and password'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username and password must be strings'),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('must provide a refresh token'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_MOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token must be a string'),
  'USER_LOGOUT_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('must provide a refresh token'),
  'USER_LOGOUT_USE_CASE.PAYLOAD_MOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token must be a string'),
  'ADD_THREAD.NOT_CONTAIN_REQUIRED_PROPERTY': new InvariantError('cannot create a new thread because the required properties are missing'),
  'ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('cannot create a new thread because the data type does not meet data type specification'),
  'ADD_COMMENT.NOT_CONTAIN_REQUIRED_PROPERTY': new InvariantError('cannot create a new comment because the required properties are missing'),
  'ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('cannot create a new comment because the data type does not meet data type specification'),
  'ADD_REPLY.NOT_CONTAIN_REQUIRED_PROPERTY': new InvariantError('cannot create a new reply because the required properties are missing'),
  'ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('cannot create a new reply because the data type does not meet data type specification'),
};

module.exports = DomainErrorTranslator;
