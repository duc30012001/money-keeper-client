// next-auth.d.ts
import 'next-auth';
import { User } from '../modules/user/types/user';

declare module 'next-auth' {
    interface Session {
        user: Pick<User, 'id' | 'email'>;
        // accessToken: string;
        error?: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        accessToken: string;
        refreshToken: string;
        error?: string;
    }
}
