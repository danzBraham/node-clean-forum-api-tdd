const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const UserRepository = require('../../../Domains/users/UserRepository');
const PasswordHash = require('../../security/PasswordHash');
const AddUserUseCase = require('../AddUserUseCase');

describe('AddUserUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'danzbraham',
      password: 'secret',
      fullname: 'Zidan Abraham',
    };

    const mockRegisteredUser = new RegisteredUser({
      id: 'user-123',
      username: 'danzbraham',
      fullname: 'Zidan Abraham',
    });

    // creating dependency of use case
    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();

    // mocking needed function
    mockUserRepository.verifyAvailableUsername = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockPasswordHash.hash = jest.fn()
      .mockImplementation(() => Promise.resolve('hashed-password'));
    mockUserRepository.addUser = jest.fn()
      .mockImplementation(() => Promise.resolve(mockRegisteredUser));

    // creating use case instance
    const addUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
    });

    // Action
    const registeredUser = await addUserUseCase.execute(useCasePayload);

    // Assert
    expect(registeredUser).toStrictEqual(new RegisteredUser({
      id: 'user-123',
      username: 'danzbraham',
      fullname: 'Zidan Abraham',
    }));
    expect(mockUserRepository.verifyAvailableUsername)
      .toHaveBeenCalledWith(useCasePayload.username);
    expect(mockPasswordHash.hash)
      .toHaveBeenCalledWith(useCasePayload.password);
    expect(mockUserRepository.addUser)
      .toHaveBeenCalledWith(new RegisterUser({
        username: 'danzbraham',
        password: 'hashed-password',
        fullname: 'Zidan Abraham',
      }));
  });
});
