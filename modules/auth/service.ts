import axios from '@/lib/axios';
import { ResponseDto } from '@/types/common';
import { User } from '../user/types';
import { GetTokenResponse, RefreshDto, SigninDto } from './types';

const PATH = '/auth';

export const authService = {
    signin: (payload: SigninDto) =>
        axios.post<ResponseDto<GetTokenResponse>>(`${PATH}/signin`, payload),

    getCurrentUser: () => axios.get<ResponseDto<User>>(`${PATH}/me`),

    refreshToken: (payload: RefreshDto) =>
        axios.post<ResponseDto<GetTokenResponse>>(`${PATH}/refresh`, payload),

    logout: () => axios.post(`${PATH}/logout`),
};
