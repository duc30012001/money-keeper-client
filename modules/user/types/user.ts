import { BaseEntity, BaseQuery } from '@/types/common';

export interface User extends BaseEntity {
    email: string;
    password: string;
    isActive: boolean;
    roles: string[];
}

export interface CreateUserDto {
    email: string;
    password: string;
    isActive?: boolean;
    roles?: string[];
}

export interface UpdateUserDto extends Partial<CreateUserDto> {}

export interface UserSearchParams extends BaseQuery {
    isActive?: string;
}
