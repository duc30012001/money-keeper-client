import axiosInstance from '@/lib/axios';
import { PaginatedResponseDto, ResponseDto } from '@/types/common';
import { CreateIconDto, Icon, UpdateIconDto } from '../types/icon';

export const iconApi = {
    findAll: () => axiosInstance.get<PaginatedResponseDto<Icon>>('/icons'),

    findOne: (id: string) =>
        axiosInstance.get<ResponseDto<Icon>>(`/icons/${id}`),

    create: (data: CreateIconDto) =>
        axiosInstance.post<ResponseDto<Icon>>('/icons', data),

    update: (id: string, data: UpdateIconDto) =>
        axiosInstance.patch<ResponseDto<Icon>>(`/icons/${id}`, data),

    remove: (id: string) => axiosInstance.delete(`/icons/${id}`),
};
