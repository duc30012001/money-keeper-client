import { AppRoute } from '@/enums/routes';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authApi } from './api/auth.api';
import { getDataFromToken } from './utils/auth';

export const authOptions: NextAuthOptions = {
    // 1) Provider đăng nhập bằng email/password
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            // @ts-ignore
            async authorize(credentials) {
                try {
                    const res = await authApi.signin({
                        email: credentials!.email,
                        password: credentials!.password,
                    });
                    const data = res.data.data;
                    // Khi login thành công, trả về đối tượng user chứa token
                    return {
                        accessToken: data.accessToken,
                        refreshToken: data.refreshToken,
                    };
                } catch (err: any) {
                    console.log('err:', err);
                    // Pass through the server's error message
                    const errorMessage =
                        err.response?.data?.message || 'Authentication failed';
                    throw new Error(errorMessage);
                }
            },
        }),
    ],

    // 2) Sử dụng JSON Web Tokens cho session
    session: { strategy: 'jwt' },

    // 3) Callback để lưu token vào JWT và session
    callbacks: {
        // Mỗi lần jwt được tạo/refresh
        async jwt({ token, user }) {
            // Lần đầu login
            if (user) {
                // @ts-ignore
                token.accessToken = user.accessToken as string;
                // @ts-ignore
                token.refreshToken = user.refreshToken as string;
            }

            // Tự động refresh nếu token sắp hết hạn
            const { accessToken } = token;
            const now = Date.now();
            const accessTokenPayload = getDataFromToken(accessToken);
            const exp = (accessTokenPayload?.exp || 0) * 1000;
            // refresh nếu còn 1 phút hoặc đã quá hạn
            if (now > exp - 60 * 1000) {
                try {
                    const res = await authApi.refreshToken({
                        refreshToken: token.refreshToken,
                    });
                    const data = res.data.data;
                    token.accessToken = data.accessToken;
                    token.refreshToken = data.refreshToken;
                } catch (error) {
                    console.log('callbacks error:', error);
                    token.error = 'RefreshFailed';
                }
            }

            return token;
        },
        // Truyền accessToken vào session trả về cho client
        async session({ session, token }) {
            const { accessToken, error } = token;

            const accessTokenData = getDataFromToken(accessToken);

            if (accessTokenData) {
                session.user = {
                    id: accessTokenData.sub,
                    email: accessTokenData.email,
                };
            }

            session.error = error;
            return session;
        },
    },

    // 4) Bảo mật
    // secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,

    // 5) Custom pages and redirects
    pages: {
        signIn: AppRoute.SIGN_IN,
        error: AppRoute.SIGN_IN, // Redirect to signin page on error
    },
};
