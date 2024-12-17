import { FakeUserRepository } from '@adapters/secondary/auth/repositories/fakeUserRepository';
import { FakePasswordHasher } from '@adapters/secondary/auth/services/fakePasswordHasher';
import { DeterministicDateProvider } from '@adapters/secondary/shared/services/deterministicDateProvider';
import { RegisterUserUseCase } from '@core-logic/auth/usecases/registerUserUseCase';
import { Email } from '../models/Email';
import { FakeMessageBus } from '@adapters/secondary/auth/services/fakeMessageBus';
import { FakeLogger } from '@adapters/secondary/auth/services/fakeLogger';

describe('RegisterUserUseCase', () => {
    let userRepository: FakeUserRepository;
    let passwordHasher: FakePasswordHasher;
    let messageBus: FakeMessageBus;
    let logger: FakeLogger;
    let deterministicDateProvider: DeterministicDateProvider;
    let registerUser: RegisterUserUseCase;

    beforeEach(() => {
        userRepository = new FakeUserRepository();
        passwordHasher = new FakePasswordHasher();
        deterministicDateProvider = new DeterministicDateProvider();
        messageBus = new FakeMessageBus();
        logger = new FakeLogger();
        registerUser = new RegisterUserUseCase(
            userRepository,
            passwordHasher,
            deterministicDateProvider,
            messageBus,
            logger
        );
    });

    it('Given valid inputs, when user registers, then account is created successfully', async () => {
        await registerUser.execute({
            email: 'melanie@zetofrais.fr',
            password: 'Astr0ngP@ssw0rd',
            agreedToTerms: true,
            subscribedToNewsletter: false,
        });
        expect(userRepository.users[0].getEmailAsString()).toBe(
            'melanie@zetofrais.fr'
        );
        expect(userRepository.users[0].getPasswordHash()).toBe(
            'hashed_Astr0ngP@ssw0rd'
        );
        expect(logger.messages).toContain('User registered');
        expect(messageBus.messages).toContainEqual({
            type: 'USER_REGISTERED',
            payload: {
                email: 'melanie@zetofrais.fr',
            },
        });
    });

    test.each([
        [
            'invalid.email@.address',
            'password123',
            true,
            false,
            'INVALID_REQUEST',
        ],

        ['melanie@zetofrais.fr', 'short', true, false, 'INVALID_REQUEST'],
        [
            'melanie@zetofrais.fr',
            'a_Password_with_no_number',
            true,
            false,
            'INVALID_REQUEST',
        ],
        [
            'melanie@zetofrais.fr',
            'a_password_with_n0_uppercase_letter',
            false,
            false,
            'INVALID_REQUEST',
        ],
        [
            'melanie@zetofrais.fr',
            'A_PASSW0RD_WITH_NO_LOWERCASE_LETTER',
            false,
            false,
            'INVALID_REQUEST',
        ],
        [
            'melanie@zetofrais.fr',
            'Astr0ngP@ssw0rd',
            false,
            false,
            'INVALID_REQUEST',
        ],
    ])(
        'Given invalid inputs (%s, %s, %s, %s), when user registers, then account is not created',
        async (
            email,
            password,
            agreedToTerms,
            subscribedToNewsletter,
            errorMessage
        ) => {
            expect(
                await registerUser.execute({
                    email,
                    password,
                    agreedToTerms,
                    subscribedToNewsletter,
                })
            ).toEqual({
                success: false,
                data: null,
                error: errorMessage,
            });
        }
    );

    it('Given valid inputs, when email address is already in use, then account is not created', async () => {
        userRepository.register(
            Email.create('melanie@zetofrais.fr'),
            'hashedP@ssw0rd',
            new Date(),
            new Date(),
            true
        );

        expect(
            await registerUser.execute({
                email: 'melanie@zetofrais.fr',
                password: 'hashedP@ssw0rd',
                agreedToTerms: true,
                subscribedToNewsletter: false,
            })
        ).toEqual({
            success: false,
            data: null,
            error: 'EMAIL_ADDRESS_ALREADY_IN_USE',
        });
    });
});