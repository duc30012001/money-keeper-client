import { BaseEntity } from '@/types/common';
import { IconType } from 'recharts/types/component/DefaultLegendContent';

export interface Icon extends BaseEntity {
    name: string;
    url: string;
    type: IconType;
}

export interface CreateIconDto {
    name: string;
    url: string;
    type: IconType;
}

export interface UpdateIconDto extends Partial<CreateIconDto> {}
