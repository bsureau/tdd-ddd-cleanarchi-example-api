import { Email } from './Email';
import { Uuid } from '../../shared/models/uuid';
import { AggregateRoot } from '@core-logic/shared/models/aggregateRoot';
import { UserRegisteredEvent } from '../events/userRegisteredEvent';

export class User extends AggregateRoot {
    constructor(
        private readonly id: Uuid,
        private readonly email: Email,
        private readonly passwordHash: string,
        private readonly createdAt: Date,
        private readonly agreedToTermsAt: Date,
        private readonly subscribedToNewsletter: boolean
    ) {
        super();
    }

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
        const user = new User(
            id,
            email,
            passwordHash,
            createdAt,
            aggregatedToTermsAt,
            subscribedToNewsletter
        );
        user.addDomainEvent(new UserRegisteredEvent(email.getValue()));
        return user;
    }
}
