import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from './types';

export function getDataFromToken(token: any) {
    if (typeof token !== 'string') return null;
    return jwtDecode<JwtPayload>(token);
}
