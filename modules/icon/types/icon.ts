import { BaseEntity } from '@/types/common';

export interface Icon extends BaseEntity {
    name: string;
    url: string;
    type: string;
}

export interface CreateIconDto {
    name: string;
    url: string;
    type: string;
}

export interface UpdateIconDto extends Partial<CreateIconDto> {}
