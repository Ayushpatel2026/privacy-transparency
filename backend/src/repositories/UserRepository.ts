import { User } from '../constants/types/User';

export interface UserRepository {
    createUser: (user: User) => Promise<User>;
    getUserById: (userId: string) => Promise<User | null>;
    getUserByEmail: (email: string) => Promise<User | null>;
    deleteUser: (userId: string) => Promise<void>;
}