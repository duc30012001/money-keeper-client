import { routing } from '@/i18n/routing';
import 'next-auth';
import messages from '../messages/en.json';
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

export type Messages = typeof messages;

declare module 'next-intl' {
    interface AppConfig {
        Locale: (typeof routing.locales)[number];
        Messages: Messages;
    }
}
