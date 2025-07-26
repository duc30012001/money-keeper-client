export interface SigninDto {
    email: string;
    password: string;
}

export interface GetTokenResponse {
    accessToken: string;
    refreshToken: string;
}

export interface RefreshDto {
    refreshToken: string;
}

export interface JwtPayload {
    sub: string; // user ID
    email: string; // user email
    iat: number; // issued at
    exp: number; // expiration
}
