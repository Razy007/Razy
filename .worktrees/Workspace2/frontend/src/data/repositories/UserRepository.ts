import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { User } from '../../domain/entities/User';
import { api } from '../../services/api';

export class UserRepository implements IUserRepository {
    async getCurrentUser(): Promise<User | null> {
        try {
            const response = await api.get<any>('/user/profile');
            if (response) {
                return this.mapToEntity(response);
            }
            return null;
        } catch (error) {
            console.error('Error fetching current user:', error);
            return null;
        }
    }

    async findByUsername(username: string): Promise<User | null> {
        try {
            const response = await api.get<any>(`/user/${username}`);
            if (response) {
                return this.mapToEntity(response);
            }
            return null;
        } catch (error) {
            console.error('Error finding user:', error);
            return null;
        }
    }

    async updateProfile(uid: string, data: Partial<User>): Promise<User> {
        const response = await api.put<any>(`/user/${uid}`, data);
        return this.mapToEntity(response);
    }

    async syncWithPiNetwork(piUser: any): Promise<User> {
         const response = await api.post<any>('/auth/pi', {
             uid: piUser.uid,
             username: piUser.username,
             accessToken: piUser.accessToken
         });
         return this.mapToEntity(response);
    }

    private mapToEntity(data: any): User {
        return new User(
            data.uid,
            data.username,
            data.avatar || '🎓',
            data.joinDate || new Date().toISOString(),
            data.level || 1,
            data.xp || 0,
            data.piBalance || 0,
            data.streak || 0,
            data.roles || []
        );
    }
}
