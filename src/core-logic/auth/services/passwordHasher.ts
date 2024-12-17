import { Password } from '@core-logic/auth/models/password';

export interface PasswordHasher {
    hash(password: Password): string;
}
