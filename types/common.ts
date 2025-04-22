/**
 * Query parameters for list endpoints.
 */
export interface BaseQuery {
    /** Full‑text search keyword */
    keyword?: string;
    /** 1‑based page number */
    page?: number;
    /** Items per page */
    pageSize?: number;
}

/**
 * Standard wrapper for single‑item responses.
 */
export interface ResponseDto<T> {
    data: T;
}

/**
 * Metadata for paginated responses.
 */
export interface PaginationMeta {
    /** Total number of items across all pages. */
    total: number;
    /** Current page number (1‑based). */
    page: number;
    /** Items per page. */
    pageSize: number;
    /** Total number of pages. */
    totalPages: number;
}

/**
 * Standard wrapper for paginated list responses.
 */
export interface PaginatedResponseDto<T> {
    /** The list of items for the current page. */
    data: T[];
    /** Pagination metadata. */
    meta: PaginationMeta;
}

export interface BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}
