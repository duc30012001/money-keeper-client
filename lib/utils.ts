import { ARRAY_SEPARATOR } from '@/constants/common';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface ApiError {
    message: string | string[];
    error: string;
    statusCode: number;
}

export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === 'string') {
        return error;
    }

    if (typeof error === 'object' && error !== null) {
        const apiError = error as ApiError;
        if (apiError.message) {
            if (Array.isArray(apiError.message)) {
                return apiError.message.join(', ');
            }
            return apiError.message;
        }
    }

    return 'An unknown error occurred';
}

export function arrayToString(
    value: any,
    separator: string = ARRAY_SEPARATOR
): string | undefined {
    if (Array.isArray(value) && value.length > 0) {
        return value.join(separator);
    }
    return undefined;
}

export function arrayFromString(
    value: any,
    separator: string = ARRAY_SEPARATOR
): string[] | undefined {
    if (typeof value === 'string') {
        return value.split(separator);
    }
    return undefined;
}

export function hexToRGB(hex: string, alpha: number) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
    } else {
        return 'rgb(' + r + ', ' + g + ', ' + b + ')';
    }
}
