import EmailAddressAlreadyInUseError from '@core-logic/auth/exceptions/emailAddressAlreadyInUseError';
import { UseCase } from '@core-logic/shared/usecases/usecase';
import { UserRepository } from '@core-logic/auth/repositories/userRepository';
import { PasswordHasher } from '@core-logic/auth/services/passwordHasher';
import { DateProvider } from '@core-logic/shared/services/dateProvider';
import { ErrorCodes } from '@core-logic/shared/model/errors';
import { Email } from '../models/Email';
import { Password } from '../models/Password';
import { InvalidDataException } from '../exceptions/invalidDataException';
import { MessageBus } from '@core-logic/shared/services/messageBus';
import { UserRegistered } from '../messages/UserRegistered';
import { Logger } from '@core-logic/shared/services/logger';

export type RegisterUserRequest = {
    email: string;
    password: string;
    agreedToTerms: boolean;
    subscribedToNewsletter: boolean;
};

export type RegisterUserResponse = {
    success: boolean;
    data: null;
    error: ErrorCodes | null;
};

export class RegisterUserUseCase
    implements UseCase<RegisterUserRequest, RegisterUserResponse>
{
    constructor(
        private userRepository: UserRepository,
        private passwordHasher: PasswordHasher,
        private dateProvider: DateProvider,
        private messageBus: MessageBus,
        private logger: Logger
    ) {}

    async execute(
        registerUserRequest: RegisterUserRequest
    ): Promise<RegisterUserResponse> {
        try {
            const { email, password, agreedToTerms, subscribedToNewsletter } =
                registerUserRequest;

            const userEmail = Email.create(email);
            await this.checkIfEmailAddressIsAlreadyInUse(userEmail);

            await this.registerUser(
                userEmail,
                password,
                agreedToTerms,
                subscribedToNewsletter
            );

            this.notifyUserRegistration(userEmail);

            return this.createSuccessResponse();
        } catch (error) {
            return this.createFailureResponse(error);
        }
    }

    private async checkIfEmailAddressIsAlreadyInUse(email: Email) {
        const emailAddressAlreadyInUse =
            await this.userRepository.findByEmail(email);

        if (emailAddressAlreadyInUse) {
            throw new EmailAddressAlreadyInUseError(
                'Email address already in use'
            );
        }
    }

    private async registerUser(
        userEmail: Email,
        password: string,
        agreedToTerms: boolean,
        subscribedToNewsletter: boolean
    ) {
        const userPassword = Password.create(password);
        const passwordHash = this.passwordHasher.hash(userPassword);

        if (!agreedToTerms) {
            throw new InvalidDataException(
                'Terms and conditions must be accepted'
            );
        }

        await this.userRepository.register(
            userEmail,
            passwordHash,
            this.dateProvider.now(),
            this.dateProvider.now(),
            subscribedToNewsletter
        );
    }

    private notifyUserRegistration(userEmail: Email) {
        this.messageBus.dispatch<UserRegistered>({
            type: 'USER_REGISTERED',
            payload: {
                email: userEmail.getValue(),
            },
        });
        this.logger.info('User registered', { email: userEmail.getValue() });
    }

    private createSuccessResponse(): RegisterUserResponse {
        return {
            success: true,
            data: null,
            error: null,
        };
    }

    private createFailureResponse(error: unknown): RegisterUserResponse {
        this.logger.error('Could not register user', { error });
        return {
            success: false,
            data: null,
            error:
                error instanceof InvalidDataException
                    ? ErrorCodes.INVALID_REQUEST
                    : error instanceof EmailAddressAlreadyInUseError
                      ? ErrorCodes.EMAIL_ADDRESS_ALREADY_IN_USE
                      : ErrorCodes.EXTERNAL_ERROR,
        };
    }
}
