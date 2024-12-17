import { Email } from './Email';

export class User {
    constructor(
        private readonly id: string,
        private readonly email: Email,
        private readonly passwordHash: string,
        private readonly createdAt: Date,
        private readonly agreedToTermsAt: Date,
        private readonly subscribedToNewsletter: boolean
    ) {}

    getId(): string {
        return this.id;
    }

    getEmail(): Email {
        return this.email;
    }

    getEmailAsString(): string {
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
}
