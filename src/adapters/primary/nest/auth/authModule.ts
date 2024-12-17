import { Module } from '@nestjs/common';
import { RegisterUserController } from '@adapters/primary/nest/auth/registerUserController';
import { RegisterUserUseCase } from '@core-logic/auth/usecases/registerUserUseCase';
import { UserRepository } from '@core-logic/auth/repositories/userRepository';
import { FakeUserRepository } from '@adapters/secondary/auth/repositories/fakeUserRepository';
import { PasswordHasher } from '@core-logic/auth/services/passwordHasher';
import { FakePasswordHasher } from '@adapters/secondary/auth/services/fakePasswordHasher';
import { DeterministicDateProvider } from '@adapters/secondary/shared/services/deterministicDateProvider';
import { DateProvider } from '@adapters/secondary/shared/services/dateProvider';
import { MessageBus } from '@core-logic/shared/services/messageBus';
import { Logger } from '@core-logic/shared/services/logger';
import { FakeMessageBus } from '@adapters/secondary/auth/services/fakeMessageBus';
import { FakeLogger } from '@adapters/secondary/auth/services/fakeLogger';

@Module({
    controllers: [RegisterUserController],
    providers: [
        {
            provide: RegisterUserUseCase,
            useFactory: (
                userRepository: UserRepository,
                passwordHasher: PasswordHasher,
                dateProvider: DateProvider,
                messageBus: MessageBus,
                logger: Logger
            ) => {
                return new RegisterUserUseCase(
                    userRepository,
                    passwordHasher,
                    dateProvider,
                    messageBus,
                    logger
                );
            },
            inject: [
                'UserRepository',
                'PasswordHasher',
                'DateProvider',
                'MessageBus',
                'Logger',
            ],
        },
        {
            provide: 'UserRepository',
            useClass: FakeUserRepository,
        },
        {
            provide: 'PasswordHasher',
            useClass: FakePasswordHasher,
        },
        {
            provide: 'DateProvider',
            useClass:
                process.env.NODE_ENV === 'test'
                    ? DeterministicDateProvider
                    : DateProvider,
        },
        {
            provide: 'MessageBus',
            useClass: FakeMessageBus,
        },
        {
            provide: 'Logger',
            useClass: FakeLogger,
        },
    ],
})
export class AuthModule {}
