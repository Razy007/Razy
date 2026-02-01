export class User {
    constructor(
        public uid: string,
        public username: string,
        public avatar: string,
        public joinDate: string,
        public level: number = 1,
        public xp: number = 0,
        public piBalance: number = 0,
        public streak: number = 0,
        public roles: string[] = []
    ) {}

    get isAdmin(): boolean {
        return this.roles.includes('admin');
    }

    get displayName(): string {
        return this.username || 'Pioneer';
    }
}
