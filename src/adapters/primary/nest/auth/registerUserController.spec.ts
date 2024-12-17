import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@adapters/primary/nest/appModule';
import { FakeUserRepository } from '@adapters/secondary/auth/repositories/fakeUserRepository';
import { DeterministicDateProvider } from '@adapters/secondary/shared/services/deterministicDateProvider';
import { Email } from '@core-logic/auth/models/Email';

describe('RegisterUserController', () => {
    let app: INestApplication;
    let userRepository: FakeUserRepository;
    let dateProvider: DeterministicDateProvider;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        userRepository = moduleRef.get('UserRepository');
        dateProvider = moduleRef.get('DateProvider');
        app = moduleRef.createNestApplication();
        await app.init();
    });

    it('Given valid inputs, when user registers, then account is created successfully', async () => {
        dateProvider.fakeDate = new Date('2021-01-01T00:00:00.000Z');
        const response = await request(app.getHttpServer())
            .post('/register')
            .send({
                email: 'melanie@zetofrais.fr',
                password: 'Astr0ngP@ssw0rd',
                agreedToTerms: true,
                subscribedToNewsletter: false,
            });

        expect(response.status).toBe(201);

        expect(userRepository.users[0].getEmailAsString()).toBe(
            'melanie@zetofrais.fr'
        );
        expect(userRepository.users[0].getPasswordHash()).toBe(
            'hashed_Astr0ngP@ssw0rd'
        );
        expect(userRepository.users[0].getCreatedAt().toISOString()).toBe(
            '2021-01-01T00:00:00.000Z'
        );
        expect(userRepository.users[0].getAgreedToTermsAt().toISOString()).toBe(
            '2021-01-01T00:00:00.000Z'
        );
        expect(userRepository.users[0].getSubscribedToNewsletter()).toBe(false);
    });

    it('Given invalid inputs, when user registers, then account is not created', async () => {
        const response = await request(app.getHttpServer())
            .post('/register')
            .send({
                email: 'melanie@zetofrais.fr',
                password: 'Astr0ngP@ssw0rd',
                agreedToTerms: false,
                subscribedToNewsletter: false,
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            success: false,
            data: null,
            error: 'INVALID_REQUEST',
        });
    });

    it('Given valid inputs, when email address is already in use, then account is not created', async () => {
        userRepository.register(
            Email.create('melanie@zetofrais.fr'),
            'hashed_Astr0ngP@ssw0rd',
            new Date(),
            new Date(),
            true
        );

        const response = await request(app.getHttpServer())
            .post('/register')
            .send({
                email: 'melanie@zetofrais.fr',
                password: 'Astr0ngP@ssw0rd',
                agreedToTerms: true,
                subscribedToNewsletter: false,
            });

        expect(response.status).toBe(409);
        expect(response.body).toEqual({
            success: false,
            data: null,
            error: 'EMAIL_ADDRESS_ALREADY_IN_USE',
        });
    });

    afterAll(async () => {
        await app.close();
    });
});