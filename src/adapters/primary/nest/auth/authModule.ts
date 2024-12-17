import { Module } from '@nestjs/common';
import { RegisterUserController } from '@adapters/primary/nest/auth/registerUserController';
import { RegisterUserUseCase } from '@core-logic/auth/usecases/registerUserUseCase';
import { UserRepository } from '@core-logic/auth/repositories/userRepository';
import { FakeUserRepository } from '@adapters/secondary/auth/repositories/fakeUserRepository';
import { PasswordHasher } from '@core-logic/auth/services/passwordHasher';
import { FakePasswordHasher } from '@adapters/secondary/auth/services/fakePasswordHasher';
import { DeterministicDateProvider } from '@adapters/secondary/shared/services/deterministicDateProvider';
import { DateProvider } from '@adapters/secondary/shared/services/dateProvider';
import { DomainEventPublisher } from '@core-logic/shared/services/domainEventPublisher';
import { Logger } from '@core-logic/shared/services/logger';
import { FakeEventPublisher } from '@adapters/secondary/auth/services/fakeEventPublisher';
import { FakeLogger } from '@adapters/secondary/auth/services/fakeLogger';
import { FakeIdGenerator } from '@adapters/secondary/shared/services/fakeIdGenerator';
import { IdGenerator } from '@core-logic/shared/services/idGenerator';

@Module({
    controllers: [RegisterUserController],
    providers: [
        {
            provide: RegisterUserUseCase,
            useFactory: (
                userRepository: UserRepository,
                passwordHasher: PasswordHasher,
                idGenerator: IdGenerator,
                dateProvider: DateProvider,
                domainEventPublisher: DomainEventPublisher,
                logger: Logger
            ) => {
                return new RegisterUserUseCase(
                    userRepository,
                    passwordHasher,
                    idGenerator,
                    dateProvider,
                    domainEventPublisher,
                    logger
                );
            },
            inject: [
                'UserRepository',
                'PasswordHasher',
                'IdGenerator',
                'DateProvider',
                'DomainEventPublisher',
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
            provide: 'IdGenerator',
            useClass: FakeIdGenerator,
        },
        {
            provide: 'DateProvider',
            useClass:
                process.env.NODE_ENV === 'test'
                    ? DeterministicDateProvider
                    : DateProvider,
        },
        {
            provide: 'DomainEventPublisher',
            useClass: FakeEventPublisher,
        },
        {
            provide: 'Logger',
            useClass: FakeLogger,
        },
    ],
})
export class AuthModule {}
