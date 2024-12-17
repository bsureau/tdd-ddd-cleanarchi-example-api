import { z } from 'zod';

const uuidSchema = z.string().uuid();

export class Uuid {
    private constructor(private readonly value: string) {}

    static create(value: string): Uuid {
        uuidSchema.parse(value);
        return new Uuid(value);
    }

    getValue(): string {
        return this.value;
    }
}
