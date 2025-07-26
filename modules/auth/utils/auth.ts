import { jwtDecode } from 'jwt-decode';
import { getToken as nextAuthGetToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { JwtPayload } from '../types/auth';

export function getDataFromToken(token: any) {
    if (typeof token !== 'string') return null;
    return jwtDecode<JwtPayload>(token);
}

export async function getToken(req: NextRequest) {
    return nextAuthGetToken({
        req,
        // , secret
    });
}
