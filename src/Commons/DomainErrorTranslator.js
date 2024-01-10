const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_REQUIRED_PROPERTY': new InvariantError('cannot create a new user because the required properties are missing'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('cannot create a new user because the data type does not match'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('cannot create a new user because the username character exceeds the limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('cannot create a new user because the username contains a restricted character'),
};

module.exports = DomainErrorTranslator;
