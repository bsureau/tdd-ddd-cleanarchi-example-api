import { z } from 'zod';
import { InvalidDataException } from '../exceptions/invalidDataException';

const passwordSchema = z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/);

export class Password {
    private constructor(private readonly value: string) {}

    getValue(): string {
        return this.value;
    }

    static validate(password: string): boolean {
        return passwordSchema.safeParse(password).success;
    }

    static create(password: string): Password {
        if (!this.validate(password))
            throw new InvalidDataException('Invalid password');
        return new Password(password);
    }
}
