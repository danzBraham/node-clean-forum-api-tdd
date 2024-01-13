const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const UserRepository = require('../../../Domains/users/UserRepository');
const PasswordHasher = require('../../security/PasswordHasher');
const AddUserUseCase = require('../AddUserUseCase');

describe('AddUserUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'danzbraham',
      password: 'secret',
      fullname: 'Zidan Abraham',
    };

    const mockedRegisteredUser = new RegisteredUser({
      id: 'user-123',
      username: 'danzbraham',
      fullname: 'Zidan Abraham',
    });

    // creating dependency of use case
    const mockUserRepository = new UserRepository();
    const mockPasswordHasher = new PasswordHasher();

    // mocking needed function
    mockUserRepository.verifyAvailableUsername = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockPasswordHasher.hash = jest.fn()
      .mockImplementation(() => Promise.resolve('hashed-password'));
    mockUserRepository.addUser = jest.fn()
      .mockImplementation(() => Promise.resolve(mockedRegisteredUser));

    // creating use case instance
    const addUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHasher: mockPasswordHasher,
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
    expect(mockPasswordHasher.hash)
      .toHaveBeenCalledWith(useCasePayload.password);
    expect(mockUserRepository.addUser)
      .toHaveBeenCalledWith(new RegisterUser({
        username: 'danzbraham',
        password: 'hashed-password',
        fullname: 'Zidan Abraham',
      }));
  });
});
