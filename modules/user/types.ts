import { BaseEntity } from '@/types/common';

export interface User extends BaseEntity {
    email: string;
    password: string;
    isActive: boolean;
    roles: string[];
}
