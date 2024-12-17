import { Injectable } from '@nestjs/common';
import { Password } from '@core-logic/auth/models/password';
import { PasswordHasher } from '@core-logic/auth/services/passwordHasher';

export class FakePasswordHasher implements PasswordHasher {
    hash(password: Password): string {
        return `hashed_${password.getValue()}`;
    }
}
