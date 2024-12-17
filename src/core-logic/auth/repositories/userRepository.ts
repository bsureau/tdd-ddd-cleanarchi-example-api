import { User } from '@core-logic/auth/models/user';
import { Email } from '../models/Email';

export interface UserRepository {
    findByEmail(email: Email): Promise<User | null>;
    register(user: User): Promise<void>;
}
