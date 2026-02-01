import { User } from '../entities/User';

export interface IUserRepository {
    getCurrentUser(): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    updateProfile(uid: string, data: Partial<User>): Promise<User>;
    syncWithPiNetwork(piUser: any): Promise<User>;
}
