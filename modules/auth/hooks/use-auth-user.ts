import { useApiError } from '@/hooks/use-api-error';
import { User } from '@/modules/user/types/user';
import { ResponseDto } from '@/types/common';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { authApi } from '../api/auth.api';

export const authKeys = {
    all: ['users'] as const,
    details: () => [...authKeys.all, 'detail'] as const,
    detail: (id: string) => [...authKeys.details(), id] as const,
};

export const useAuthUser = () => {
    const { handleError } = useApiError();
    const { data } = useSession();
    return useQuery<ResponseDto<User>>({
        queryKey: authKeys.detail(data?.user.id ?? ''),
        queryFn: async () => {
            const response = await authApi.getCurrentUser();
            return response.data;
        },
        onError: handleError,
    } as UseQueryOptions<ResponseDto<User>>);
};
