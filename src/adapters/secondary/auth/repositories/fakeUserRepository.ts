import { User } from '@core-logic/auth/models/user';
import { UserRepository } from '@core-logic/auth/repositories/userRepository';
import { Email } from '@core-logic/auth/models/Email';

export class FakeUserRepository implements UserRepository {
    public users: User[];

    constructor() {
        this.users = [];
    }
    async findByEmail(email: Email): Promise<User | null> {
        return (
            this.users.find(user => user.getEmail() === email.getValue()) ||
            null
        );
    }
    async register(user: User): Promise<void> {
        this.users.push(user);
    }
}
