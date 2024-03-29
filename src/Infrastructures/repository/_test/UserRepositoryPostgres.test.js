const InvariantError = require('../../../Commons/exceptions/InvariantError');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const pool = require('../../database/postgres/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableUsername function', () => {
    it('should throw an InvariantError if the username is unavailable', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'danzbraham' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('danzbraham'))
        .rejects
        .toThrow(InvariantError);
    });

    it('should not throw an InvariantError if the username is available', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('danzbraham'))
        .resolves
        .not.toThrow(InvariantError);
    });
  });

  describe('addUser function', () => {
    it('should persist a new user in the database correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'danzbraham',
        password: 'secret',
        fullname: 'Zidan Abraham',
      });

      const fakeIdGenerator = () => '123';
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await userRepositoryPostgres.addUser(registerUser);

      // Assert
      const users = await UsersTableTestHelper.findUserById('user-123');
      expect(users).toHaveLength(1);
    });

    it('should return registered user correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'danzbraham',
        password: 'secret',
        fullname: 'Zidan Abraham',
      });

      const expectedRegisteredUser = new RegisteredUser({
        id: 'user-123',
        username: registerUser.username,
        fullname: registerUser.fullname,
      });

      const fakeIdGenerator = () => '123';
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      // Assert
      expect(registeredUser).toStrictEqual(expectedRegisteredUser);
    });
  });

  describe('getIdByUsername function', () => {
    it('should throw an InvariantError if the user does not exist', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.getIdByUsername('danzbraham'))
        .rejects
        .toThrow(InvariantError);
    });

    it('should return the correct user ID if the user exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'danzbraham' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action
      const id = await userRepositoryPostgres.getIdByUsername('danzbraham');

      // Assert
      expect(id).toEqual('user-123');
    });
  });

  describe('getPasswordByUsername function', () => {
    it('should throw an InvariantError if the user does not exist', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.getPasswordByUsername('danzbraham'))
        .rejects
        .toThrow(InvariantError);
    });

    it('should return the correct user password if the user exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'danzbraham', password: 'secret' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action
      const password = await userRepositoryPostgres.getPasswordByUsername('danzbraham');

      // Assert
      expect(password).toEqual('secret');
    });
  });
});
