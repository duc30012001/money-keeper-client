import { getToken as nextAuthGetToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

// const secret = process.env.NEXT_PUBLIC_NEXTAUTH_SECRET!;

export async function getToken(req: NextRequest) {
    return nextAuthGetToken({
        req,
        // , secret
    });
}
