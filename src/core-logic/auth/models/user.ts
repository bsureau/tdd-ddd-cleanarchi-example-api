import { Email } from './Email';
import { Uuid } from '../../shared/models/uuid';

export class User {
    constructor(
        private readonly id: Uuid,
        private readonly email: Email,
        private readonly passwordHash: string,
        private readonly createdAt: Date,
        private readonly agreedToTermsAt: Date,
        private readonly subscribedToNewsletter: boolean
    ) {}

    getId(): string {
        return this.id.getValue();
    }

    getEmail(): string {
        return this.email.getValue();
    }

    getPasswordHash(): string {
        return this.passwordHash;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    getAgreedToTermsAt(): Date {
        return this.agreedToTermsAt;
    }

    getSubscribedToNewsletter(): boolean {
        return this.subscribedToNewsletter;
    }

    static create(
        id: Uuid,
        email: Email,
        passwordHash: string,
        createdAt: Date,
        aggregatedToTermsAt: Date,
        subscribedToNewsletter: boolean
    ): User {
        return new User(
            id,
            email,
            passwordHash,
            createdAt,
            aggregatedToTermsAt,
            subscribedToNewsletter
        );
    }
}
