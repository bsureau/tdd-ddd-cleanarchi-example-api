import { z } from 'zod';
import { InvalidDataException } from '../exceptions/invalidDataException';

const emailSchema = z.string().email();

export class Email {
    private constructor(private readonly value: string) {}

    getValue(): string {
        return this.value;
    }

    static validate(email: string): boolean {
        return emailSchema.safeParse(email).success;
    }

    static create(email: string): Email {
        if (!this.validate(email))
            throw new InvalidDataException('Invalid email address');
        return new Email(email);
    }
}
