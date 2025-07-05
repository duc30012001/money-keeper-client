import { BaseEntity, BaseQuery } from '@/types/common';
import { UserRole } from '../enums/user';

export interface User extends BaseEntity {
    email: string;
    password: string;
    isActive: boolean;
    role: UserRole;
}

export interface CreateUserDto {
    email: string;
    password: string;
    isActive?: boolean;
    role?: UserRole;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {}

export interface UserSearchParams extends BaseQuery {
    isActive?: string;
}
