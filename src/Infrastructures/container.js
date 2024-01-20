// istanbul ignore file
const { createContainer } = require('instances-container');

// external agencies
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');
const pool = require('./database/postgres/pool');

// infrastructure services (concrete repository, helper, manager, etc)
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres');
const ThreadRepositoryPostgres = require('./repository/ThreadRepositoryPostgres');
const CommentRepositoryPostgres = require('./repository/CommentRepositoryPostgres');
const ReplyRepositoryPostgres = require('./repository/ReplyRepositoryPostgres');

const BcryptPasswordHasher = require('./security/BcryptPasswordHasher');
const JwtTokenManager = require('./security/JwtTokenManager');

// domain repositories
const UserRepository = require('../Domains/users/UserRepository');
const AuthenticationRepository = require('../Domains/authentications/AuthenticationRepository');
const ThreadRepository = require('../Domains/threads/ThreadRepository');
const CommentRepository = require('../Domains/comments/CommentRepository');
const ReplyRepository = require('../Domains/replies/ReplyRepository');

// app helpers
const PasswordHasher = require('../Applications/security/PasswordHasher');
const AuthenticationTokenManager = require('../Applications/security/AuthenticationTokenManager');

// app use cases
const AddUserUseCase = require('../Applications/use_case/users/AddUserUseCase');

const LoginUserUseCase = require('../Applications/use_case/authentications/LoginUserUseCase');
const RefreshAuthenticationUseCase = require('../Applications/use_case/authentications/RefreshAuthenticationUseCase');
const LogoutUserUseCase = require('../Applications/use_case/authentications/LogoutUserUseCase');

const AddThreadUseCase = require('../Applications/use_case/threads/AddThreadUseCase');
const GetThreadByIdUseCase = require('../Applications/use_case/threads/GetThreadByIdUseCase');

const AddCommentUseCase = require('../Applications/use_case/comments/AddCommentUseCase');
const DeleteCommentUseCase = require('../Applications/use_case/comments/DeleteCommentUseCase');

const AddReplyUseCase = require('../Applications/use_case/replies/AddReplyUseCase');
const DeleteReplyUseCase = require('../Applications/use_case/replies/DeleteReplyUseCase');

// creating container
const container = createContainer();

// registering services and repository
container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        { concrete: pool },
        { concrete: nanoid },
      ],
    },
  },
  {
    key: AuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [
        { concrete: pool },
      ],
    },
  },
  {
    key: ThreadRepository.name,
    Class: ThreadRepositoryPostgres,
    parameter: {
      dependencies: [
        { concrete: pool },
        { concrete: nanoid },
      ],
    },
  },
  {
    key: CommentRepository.name,
    Class: CommentRepositoryPostgres,
    parameter: {
      dependencies: [
        { concrete: pool },
        { concrete: nanoid },
      ],
    },
  },
  {
    key: ReplyRepository.name,
    Class: ReplyRepositoryPostgres,
    parameter: {
      dependencies: [
        { concrete: pool },
        { concrete: nanoid },
      ],
    },
  },
  {
    key: PasswordHasher.name,
    Class: BcryptPasswordHasher,
    parameter: {
      dependencies: [
        { concrete: bcrypt },
      ],
    },
  },
  {
    key: AuthenticationTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        { concrete: Jwt.token },
      ],
    },
  },
]);

// registering use cases
container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'userRepository', internal: UserRepository.name },
        { name: 'passwordHasher', internal: PasswordHasher.name },
      ],
    },
  },
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'userRepository', internal: UserRepository.name },
        { name: 'authenticationRepository', internal: AuthenticationRepository.name },
        { name: 'authenticationTokenManager', internal: AuthenticationTokenManager.name },
        { name: 'passwordHasher', internal: PasswordHasher.name },
      ],
    },
  },
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'authenticationRepository', internal: AuthenticationRepository.name },
        { name: 'authenticationTokenManager', internal: AuthenticationTokenManager.name },
      ],
    },
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'authenticationRepository', internal: AuthenticationRepository.name },
      ],
    },
  },
  {
    key: AddThreadUseCase.name,
    Class: AddThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'threadRepository', internal: ThreadRepository.name },
      ],
    },
  },
  {
    key: GetThreadByIdUseCase.name,
    Class: GetThreadByIdUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'threadRepository', internal: ThreadRepository.name },
      ],
    },
  },
  {
    key: AddCommentUseCase.name,
    Class: AddCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'commentRepository', internal: CommentRepository.name },
        { name: 'threadRepository', internal: ThreadRepository.name },
      ],
    },
  },
  {
    key: DeleteCommentUseCase.name,
    Class: DeleteCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'commentRepository', internal: CommentRepository.name },
        { name: 'threadRepository', internal: ThreadRepository.name },
      ],
    },
  },
  {
    key: AddReplyUseCase.name,
    Class: AddReplyUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'replyRepository', internal: ReplyRepository.name },
        { name: 'commentRepository', internal: CommentRepository.name },
        { name: 'threadRepository', internal: ThreadRepository.name },
      ],
    },
  },
  {
    key: DeleteReplyUseCase.name,
    Class: DeleteReplyUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'replyRepository', internal: ReplyRepository.name },
        { name: 'commentRepository', internal: CommentRepository.name },
        { name: 'threadRepository', internal: ThreadRepository.name },
      ],
    },
  },
]);

module.exports = container;
